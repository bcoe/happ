import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { RxDragHandleHorizontal } from "react-icons/rx";
import { FaTrashAlt } from "react-icons/fa";
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
    <div className={'grid grid-cols-12'}>
      <div className={'col-span-11 bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow habit-item'} ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className={'grid grid-cols-12'}>
          <div>
            {props.disabled ? '' : <RxDragHandleHorizontal className="mt-2" />}
          </div>
          <div className={'col-span-10 mt-0.5'}>
            {props.name}
          </div>
          <div className={'text-right'}>
            <input type="checkbox" checked={props.status} disabled={!props.disabled} onChange={handleChange} className={'w-4 h-4 mt-2'} />
          </div>
        </div>
      </div>
      <div className={'col-span-1'}>
        {props.disabled ? '' : <button onClick={handleDelete}><FaTrashAlt className="mt-3 ml-3" /></button>}
      </div>
    </div>
  );
}
