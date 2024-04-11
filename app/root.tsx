import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import { useEffect, useState } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import { ttt } from './helpers/text-to-tailwind';
import React, {useState} from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {SortableItem} from './sortable-item';

function App() {
  const [items, setItems] = useState([{id: 1, value: 'make coffee'}, {id: 2, value: 'brush my teeth'}, {id: 3, value: 'be rad'}, {id: 4, value: 'go climb a mountain'}]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <div className={ttt('header')}/>
        <div className={ttt('grid grid-cols-3')}>
          <div />
          <div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map(item => <SortableItem value={item.value} key={item.id} id={item.id} />)}
                </SortableContext>
            </DndContext>
          </div>
          <div />
        </div>
        <Scripts />
      </body>
    </html>
  );

  function handleDragEnd(event) {
    const {active, over} = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
};

export default withSentry(App);
