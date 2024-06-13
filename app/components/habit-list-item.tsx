import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { RxDragHandleHorizontal } from "react-icons/rx";
// import { FaTrashAlt } from "react-icons/fa";
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

  async function handleDelete() {
    console.info(props.id);
  }
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className='flex w-full bg-white text-gray-800 py-2 px-4 border border-gray-400 rounded shadow habit-item disable-touch' >
        <div {...listeners} className="w-8 mr-2">
          {props.disabled ? '' : <RxDragHandleHorizontal className="mt-1 size-6" />}
        </div>
        <div className='w-5/6 mt-0.5'>
          {props.name}
        </div>
        <div className='w-1/6 text-right'>
          <input type="checkbox" checked={props.status} onChange={handleChange} className={'w-4 h-4 mt-2'} />
        </div>
      </div>
    </div>
  );
}
