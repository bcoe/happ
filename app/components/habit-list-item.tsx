import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { RxDragHandleHorizontal } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { useHabits } from '../providers/habits';

export function HabitListItem(props) {
  const habits = useHabits();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id, disabled: props.disabled});

  async function handleChange(event) {
    event.preventDefault();
    await habits.toggle(props.id);
    await habits.load();
  }

  async function handleEdit() {
    habits.setEditing(true, props.id);
  }

  function hideRow() {
    const habitAppliesToDay = !props.days || props.days[habits.currentDayOfWeek];
    return props.disabled === true && habitAppliesToDay === false;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    hideRow() ? null : (
      <div ref={setNodeRef} style={style} {...attributes}>
        <div
          {...listeners}
          className={`flex items-center w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-md px-3 py-2.5 mb-1.5 transition-colors disable-touch ${props.disabled ? '' : 'cursor-grab active:cursor-grabbing'}`}
        >
          <div className="mr-2 text-zinc-700">
            {props.disabled ? null : <RxDragHandleHorizontal className="size-4" />}
          </div>
          <div className="flex-1 text-sm text-zinc-200">
            {props.name}
          </div>
          <div className="ml-3">
            {props.disabled
              ? (
                <input
                  type="checkbox"
                  name={`habit-${props.id}`}
                  checked={props.status}
                  onChange={handleChange}
                  className="w-4 h-4 accent-violet-500 cursor-pointer"
                />
              )
              : (
                <FiEdit
                  className="size-3.5 text-zinc-600 hover:text-zinc-300 cursor-pointer transition-colors"
                  onClick={handleEdit}
                />
              )
            }
          </div>
        </div>
      </div>
    )
  );
}
