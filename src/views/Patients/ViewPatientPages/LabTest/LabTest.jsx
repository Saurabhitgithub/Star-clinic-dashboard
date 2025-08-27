

// File: LabsDashboard.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LabTest = () => {
  const [labData, setLabData] = useState([
    { stage: 'Backlog', count: 1, patients: [{ name: 'Alex A', initials: 'LH', count: 1 }] },
    { stage: 'Requested', count: 1, patients: [{ name: 'Alex A', initials: 'LH', count: 1 }] },
    { stage: 'Received', count: 2, patients: [
      { name: 'Alex A', initials: 'LH', count: 459 },
      { name: 'Alex A', initials: 'LH', count: 459 },
    ] },
    { stage: 'Reviewing', count: 1, patients: [{ name: 'Alex A', initials: 'LH', count: 1 }] },
    
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(labData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLabData(items);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">  
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Labs</h2>
        <span className="bg-blue-500 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
          {labData.length}
        </span>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="labs" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {labData.map((stageData, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white rounded-lg shadow-md p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-600">{stageData.stage}</h3>
                        <span className="text-sm font-semibold text-gray-800">
                          {stageData.count} request{stageData.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {stageData.patients.map((patient, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                                {patient.initials}
                              </div>
                              <span className="text-sm text-gray-800">{patient.name}</span>
                            </div>
                            <span className={`text-sm font-semibold ${patient.count > 1 ? 'text-red-500' : 'text-yellow-500'}`}>
                              {patient.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LabTest;
