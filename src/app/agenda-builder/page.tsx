'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Keynote, Experience, Workshop } from '@/types/content';
import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';
import { ChevronDown, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  type: 'fixed' | 'keynote-slot' | 'experience-slot' | 'open-slot';
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
    zIndex: 1000,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 rounded-xl transition-colors relative group ${
        isUsed 
          ? 'opacity-40 cursor-not-allowed glass-card-dark' 
          : type === 'keynote' 
            ? 'glass-card bg-gradient-to-br from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 cursor-move' 
            : 'glass-card bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 cursor-move'
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm line-clamp-2 pr-2">{item.title}</h3>
          <p className="text-xs text-white/70 mt-1">
            {type === 'keynote' ? (item as Keynote).presenter : `${(item as Experience).type} Experience`}
          </p>
          {type === 'experience' && (item as Experience).tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {(item as Experience).tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 capitalize"
                >
                  {tag.toLowerCase()}
                </span>
              ))}
              {(item as Experience).tags.length > 2 && (
                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                  +{(item as Experience).tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        {type === 'experience' && (
          <Link
            href={`/experiences/${item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
          >
            <ExternalLink className="w-4 h-4 text-white/70 hover:text-white" />
          </Link>
        )}
      </div>
    </div>
  );
}

function DroppableSlot({ slot, onRemove }: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: slot.id,
    data: { slotType: slot.type },
  });

  const canDrop = slot.type === 'keynote-slot' || slot.type === 'experience-slot' || slot.type === 'open-slot';
  
  return (
    <div
      ref={setNodeRef}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        slot.type === 'fixed' 
          ? 'glass-card-dark' 
          : slot.filled
            ? 'glass-card'
            : 'glass-card-dark border-2 border-dashed ' + 
              (slot.type === 'keynote-slot' 
                ? 'border-blue-500/50' 
                : slot.type === 'experience-slot' 
                  ? 'border-green-500/50' 
                  : 'border-purple-500/50')
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
              {slot.type === 'open-slot' && !slot.filled && (
                <span className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300">Keynote or Experience</span>
              )}
            </div>
            {slot.filled ? (
              <>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">{slot.filled.title}</h3>
                    <p className="text-sm text-white/70">
                      {slot.filledType === 'keynote' 
                        ? (slot.filled as Keynote).presenter 
                        : `${(slot.filled as Experience).type} Experience`}
                    </p>
                  </div>
                  
                  {slot.filledType === 'experience' && (
                    <Link
                      href={`/experiences/${slot.filled.id}`}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white/70 hover:text-white" />
                    </Link>
                  )}
                </div>
                
                {slot.filledType === 'experience' && (slot.filled as Experience).tags && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(slot.filled as Experience).tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80 capitalize"
                      >
                        {tag.toLowerCase()}
                      </span>
                    ))}
                    {(slot.filled as Experience).tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                        +{(slot.filled as Experience).tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="font-semibold text-white/90">{slot.title}</h3>
                {canDrop && (
                  <p className="text-xs text-white/50 mt-1">
                    Drag a {
                      slot.type === 'keynote-slot' 
                        ? 'keynote' 
                        : slot.type === 'experience-slot' 
                          ? 'experience' 
                          : 'keynote or experience'
                    } here
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
              <X className="w-4 h-4 text-red-300" />
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
    { id: '6', time: '1:00 PM', title: 'Flexible Slot', type: 'open-slot' },
    { id: '7', time: '2:00 PM', title: 'Hands-on Build Session', type: 'fixed' },
    { id: '8', time: '2:30 PM', title: 'Presentation & Demo', type: 'fixed' },
    { id: '9', time: '3:00 PM', title: 'Closing Remarks', type: 'fixed' },
  ]);

  const [keynotes, setKeynotes] = useState<Keynote[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [usedItems, setUsedItems] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'keynotes' | 'experiences'>('keynotes');
  const [selectedOffering, setSelectedOffering] = useState<{ id: string; title: string; type: string } | null>(null);

  useEffect(() => {
    // Fetch keynotes using the same method as the rest of the site
    const fetchKeynotes = async () => {
      try {
        const response = await fetch('/api/keynotes');
        const data = await response.json();
        if (data.success) {
          setKeynotes(data.data);
        }
      } catch (error) {
        console.error('Error fetching keynotes:', error);
      }
    };

    // Fetch experiences using the same method as the rest of the site
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        const data = await response.json();
        if (data.success) {
          setExperiences(data.data);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    // Fetch workshops using the same method as the rest of the site
    const fetchWorkshops = async () => {
      try {
        const response = await fetch('/api/workshops');
        const data = await response.json();
        if (data.success) {
          setWorkshops(data.data);
        }
      } catch (error) {
        console.error('Error fetching workshops:', error);
      }
    };

    fetchKeynotes();
    fetchExperiences();
    fetchWorkshops();
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
      (draggedType === 'keynote' && (slotType === 'keynote-slot' || slotType === 'open-slot')) ||
      (draggedType === 'experience' && (slotType === 'experience-slot' || slotType === 'open-slot'))
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
    <main className="min-h-screen">
      <Navigation />
      
      <DndContext 
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Hero Section */}
        <section className="pt-32 pb-16 section-padding">
          <div className="container-max">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Agenda Builder
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Customize your AI Centre experience by dragging keynotes and experiences into flexible time slots
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-visible">
              {/* Agenda Timeline */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6 lg:p-8">
                  <div className="mb-6">
                    {/* Title as Dropdown */}
                    <div className="relative flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                      <select
                        value={selectedOffering?.id || ''}
                        onChange={(e) => {
                          const id = e.target.value;
                          const selected = workshops.find(w => w.id === id);
                          setSelectedOffering(selected ? { id: selected.id, title: selected.title, type: 'workshop' } : null);
                        }}
                        className="flex-1 text-2xl font-bold text-white bg-transparent appearance-none cursor-pointer focus:outline-none hover:text-white/90 transition-colors pr-10 min-w-0"
                        style={{ paddingLeft: '0', fontSize: '1.5rem', lineHeight: '2rem' }}
                      >
                        <option value="">Select a Standard Offering</option>
                        {workshops.map(workshop => (
                          <option key={workshop.id} value={workshop.id}>
                            {workshop.title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-0 flex items-center pointer-events-none">
                        <ChevronDown className="w-6 h-6 text-white/60" />
                      </div>
                    </div>
                  </div>
                  
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

              {/* Palette with Tabs */}
              <div className="glass-card p-6">
                {/* Tab Navigation */}
                <div className="flex mb-6 bg-black/20 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('keynotes')}
                    className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                      activeTab === 'keynotes'
                        ? 'bg-blue-600 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Keynotes
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('experiences')}
                    className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                      activeTab === 'experiences'
                        ? 'bg-green-600 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Experiences
                    </span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === 'keynotes' ? (
                    <div className="space-y-3">
                      {keynotes.length === 0 ? (
                        <div className="text-center py-16">
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
                  ) : (
                    <div className="space-y-3">
                      {experiences.length === 0 ? (
                        <div className="text-center py-16">
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <DragOverlay dropAnimation={null}>
          {activeId && getActiveItem() && (
            <div 
              className={`p-4 rounded-xl shadow-2xl cursor-grabbing ${
                activeId.startsWith('keynote') 
                  ? 'bg-blue-600 border border-blue-400' 
                  : 'bg-green-600 border border-green-400'
              }`}
              style={{ opacity: 1, position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
            >
              <h3 className="font-semibold text-white text-sm line-clamp-2">{getActiveItem()!.title}</h3>
              <p className="text-xs text-white/90 mt-2">
                {activeId.startsWith('keynote') 
                  ? (getActiveItem() as Keynote).presenter 
                  : `${(getActiveItem() as Experience).type} Experience`}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <ContactBanner />
    </main>
  );
}