'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Keynote, Experience } from '@/types/content';
import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  type: 'fixed' | 'keynote-slot' | 'experience-slot';
  filled?: Keynote | Experience;
  filledType?: 'keynote' | 'experience';
}

interface DraggableItemProps {
  item: Keynote | Experience;
  type: 'keynote' | 'experience';
  isUsed: boolean;
}

interface DroppableSlotProps {
  slot: AgendaItem;
  onRemove: (slotId: string) => void;
}

function DraggableItem({ item, type, isUsed }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${type}-${item.id}`,
    data: { item, type },
    disabled: isUsed,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 rounded-xl transition-all ${
        isUsed 
          ? 'opacity-40 cursor-not-allowed glass-card-dark' 
          : type === 'keynote' 
            ? 'glass-card bg-gradient-to-br from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 cursor-move' 
            : 'glass-card bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 cursor-move'
      } ${isDragging ? 'opacity-50 scale-105' : ''}`}
    >
      <h3 className="font-semibold text-white text-sm line-clamp-2">{item.title}</h3>
      <p className="text-xs text-white/70 mt-2">{item.presenter || item.type}</p>
    </div>
  );
}

function DroppableSlot({ slot, onRemove }: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: slot.id,
    data: { slotType: slot.type },
  });

  const canDrop = slot.type === 'keynote-slot' || slot.type === 'experience-slot';
  
  return (
    <div
      ref={setNodeRef}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        slot.type === 'fixed' 
          ? 'glass-card-dark' 
          : slot.filled
            ? 'glass-card'
            : 'glass-card-dark border-2 border-dashed ' + 
              (slot.type === 'keynote-slot' ? 'border-blue-500/50' : 'border-green-500/50')
      } ${isOver && canDrop ? 'ring-2 ring-white scale-[1.02]' : ''}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <p className="text-sm text-white/60 font-medium">{slot.time}</p>
              {slot.type === 'keynote-slot' && !slot.filled && (
                <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300">Keynote Slot</span>
              )}
              {slot.type === 'experience-slot' && !slot.filled && (
                <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-300">Experience Slot</span>
              )}
            </div>
            {slot.filled ? (
              <>
                <h3 className="font-bold text-white text-lg mb-1">{slot.filled.title}</h3>
                <p className="text-sm text-white/70">
                  {slot.filledType === 'keynote' 
                    ? (slot.filled as Keynote).presenter 
                    : `${(slot.filled as Experience).type} Experience`}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-white/90">{slot.title}</h3>
                {canDrop && (
                  <p className="text-xs text-white/50 mt-1">
                    Drag a {slot.type === 'keynote-slot' ? 'keynote' : 'experience'} here
                  </p>
                )}
              </>
            )}
          </div>
          {slot.filled && canDrop && (
            <button
              onClick={() => onRemove(slot.id)}
              className="ml-2 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              aria-label="Remove item"
            >
              <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {/* Gradient overlay for filled slots */}
      {slot.filled && (
        <div className={`absolute inset-0 opacity-10 pointer-events-none ${
          slot.filledType === 'keynote' 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
            : 'bg-gradient-to-br from-green-500 to-emerald-500'
        }`} />
      )}
    </div>
  );
}

export default function AgendaBuilderPage() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([
    { id: '1', time: '9:00 AM', title: 'Welcome & Registration', type: 'fixed' },
    { id: '2', time: '9:30 AM', title: 'Introduction', type: 'fixed' },
    { id: '3', time: '10:00 AM', title: 'Keynote Slot', type: 'keynote-slot' },
    { id: '4', time: '11:00 AM', title: 'Ideation Workshop', type: 'fixed' },
    { id: '5', time: '12:00 PM', title: 'Lunch Break', type: 'fixed' },
    { id: '6', time: '1:00 PM', title: 'Experience Slot', type: 'experience-slot' },
    { id: '7', time: '2:00 PM', title: 'Hands-on Build Session', type: 'fixed' },
    { id: '8', time: '2:30 PM', title: 'Presentation & Demo', type: 'fixed' },
    { id: '9', time: '3:00 PM', title: 'Closing Remarks', type: 'fixed' },
  ]);

  const [keynotes, setKeynotes] = useState<Keynote[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [usedItems, setUsedItems] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch keynotes
    fetch('/api/keynotes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setKeynotes(data.data);
        }
      })
      .catch(console.error);

    // Fetch experiences
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExperiences(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const dragData = active.data.current;
    const dropData = over.data.current;

    if (!dragData || !dropData) return;

    const draggedItem = dragData.item;
    const draggedType = dragData.type;
    const slotType = dropData.slotType;

    // Check if the item type matches the slot type
    if (
      (draggedType === 'keynote' && slotType === 'keynote-slot') ||
      (draggedType === 'experience' && slotType === 'experience-slot')
    ) {
      setAgenda(prev => prev.map(slot => {
        if (slot.id === over.id) {
          // If slot already has an item, remove it from used items
          if (slot.filled) {
            setUsedItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(`${slot.filledType}-${slot.filled!.id}`);
              return newSet;
            });
          }
          
          // Add new item to used items
          setUsedItems(prev => new Set(prev).add(`${draggedType}-${draggedItem.id}`));
          
          return {
            ...slot,
            filled: draggedItem,
            filledType: draggedType,
          };
        }
        return slot;
      }));
    }
  };

  const handleRemove = (slotId: string) => {
    setAgenda(prev => prev.map(slot => {
      if (slot.id === slotId && slot.filled) {
        // Remove from used items
        setUsedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(`${slot.filledType}-${slot.filled!.id}`);
          return newSet;
        });
        
        return {
          ...slot,
          filled: undefined,
          filledType: undefined,
        };
      }
      return slot;
    }));
  };

  const getActiveItem = () => {
    if (!activeId) return null;
    const [type, id] = activeId.split('-');
    if (type === 'keynote') {
      return keynotes.find(k => k.id === id);
    } else if (type === 'experience') {
      return experiences.find(e => e.id === id);
    }
    return null;
  };

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="min-h-screen">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 section-padding overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-indigo-900/20"></div>
          
          <div className="container-max relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Agenda Builder
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Customize your AI Centre experience by dragging keynotes and experiences into flexible time slots
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Agenda Timeline */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 lg:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Event Schedule
                  </h2>
                  <div className="space-y-4">
                    {agenda.map(slot => (
                      <DroppableSlot 
                        key={slot.id} 
                        slot={slot} 
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Palettes */}
              <div className="space-y-6">
                {/* Keynotes Palette */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Available Keynotes
                  </h2>
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {keynotes.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                        <p className="text-white/60 text-sm">Loading keynotes...</p>
                      </div>
                    ) : (
                      keynotes.map(keynote => (
                        <DraggableItem
                          key={keynote.id}
                          item={keynote}
                          type="keynote"
                          isUsed={usedItems.has(`keynote-${keynote.id}`)}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Experiences Palette */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Available Experiences
                  </h2>
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {experiences.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
                        <p className="text-white/60 text-sm">Loading experiences...</p>
                      </div>
                    ) : (
                      experiences.map(experience => (
                        <DraggableItem
                          key={experience.id}
                          item={experience}
                          type="experience"
                          isUsed={usedItems.has(`experience-${experience.id}`)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ContactBanner />
      </main>

      <DragOverlay>
        {activeId && getActiveItem() && (
          <div className={`p-4 rounded-xl shadow-2xl glass-card ${
            activeId.startsWith('keynote') 
              ? 'bg-gradient-to-br from-blue-600/30 to-indigo-600/30' 
              : 'bg-gradient-to-br from-green-600/30 to-emerald-600/30'
          }`}>
            <h3 className="font-semibold text-white text-sm">{getActiveItem()!.title}</h3>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}