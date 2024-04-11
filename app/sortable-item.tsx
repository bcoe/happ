import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { RxDragHandleHorizontal } from "react-icons/rx";
import { ttt } from './helpers/text-to-tailwind';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div className={ttt('bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow')} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={ttt('grid grid-cols-12')}>
        <div>
          <RxDragHandleHorizontal />
        </div>
        <div className={ttt('col-span-10')}>
          {props.value}
        </div>
        <div>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  );
}
