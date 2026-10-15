'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Keynote, Experience, Workshop, AgendaItem } from '@/types/content';
import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';
import { ChevronDown, X, ExternalLink, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

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
      className={`${styles.draggable} ${
        isUsed
          ? `${styles.draggableUsed} glass-card-dark`
          : type === 'keynote'
            ? `glass-card ${styles.draggableKeynote}`
            : `glass-card ${styles.draggableExperience}`
      } ${isDragging ? styles.draggableDragging : ''}`}
    >
      <div className={styles.draggableHeadRow}>
        <div className={styles.draggableBody}>
          <h3 className={styles.draggableTitle}>{item.title}</h3>
          <p className={styles.draggableSubtitle}>
            {type === 'keynote' ? (item as Keynote).presenter : `${(item as Experience).type} Experience`}
          </p>
          {type === 'experience' && (item as Experience).tags && (
            <div className={styles.tagRow}>
              {(item as Experience).tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className={styles.tagPill}
                >
                  {tag.toLowerCase()}
                </span>
              ))}
              {(item as Experience).tags.length > 2 && (
                <span className={styles.tagPillMuted}>
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
            className={styles.externalLink}
          >
            <ExternalLink className={styles.externalLinkIcon} />
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

  const canDrop = slot.type === 'Keynote' || slot.type === 'Experience' || slot.type === 'Open Slot';
  
  return (
    <div
      ref={setNodeRef}
      className={`${styles.slot} ${
        slot.type === 'Session'
          ? 'glass-card-dark'
          : slot.filled
            ? 'glass-card'
            : `glass-card-dark ${
              slot.type === 'Keynote'
                ? styles.slotDashedBlue
                : slot.type === 'Experience'
                  ? styles.slotDashedGreen
                  : styles.slotDashedPurple
            }`
      } ${isOver && canDrop ? styles.slotOver : ''}`}
    >
      <div className={styles.slotBody}>
        <div className={styles.slotHeadRow}>
          <div className={styles.slotMain}>
            <div className={styles.slotMetaRow}>
              {slot.time.length > 0 && (
                <p className={styles.slotTime}>{slot.time}</p>
              )}
              {slot.type === 'Keynote' && !slot.filled && (
                <span className={`${styles.slotBadge} ${styles.slotBadgeBlue}`}>Keynote Slot</span>
              )}
              {slot.type === 'Experience' && !slot.filled && (
                <span className={`${styles.slotBadge} ${styles.slotBadgeGreen}`}>Experience Slot</span>
              )}
              {slot.type === 'Open Slot' && !slot.filled && (
                <span className={`${styles.slotBadge} ${styles.slotBadgePurple}`}>Keynote or Experience</span>
              )}
            </div>
            {slot.filled ? (
              <>
                <div className={styles.filledHeadRow}>
                  <div className={styles.slotMain}>
                    <h3 className={styles.filledTitle}>{slot.filled.title}</h3>
                    <p className={styles.filledSubtitle}>
                      {slot.filledType === 'keynote'
                        ? (slot.filled as Keynote).presenter
                        : `${(slot.filled as Experience).type} Experience`}
                    </p>
                  </div>

                  {slot.filledType === 'experience' && (
                    <Link
                      href={`/experiences/${slot.filled.id}`}
                      className={styles.slotLinkButton}
                    >
                      <ExternalLink className={styles.externalLinkIcon} />
                    </Link>
                  )}
                </div>

                {slot.filledType === 'experience' && (slot.filled as Experience).tags && (
                  <div className={styles.slotTagRow}>
                    {(slot.filled as Experience).tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className={styles.tagPill}
                      >
                        {tag.toLowerCase()}
                      </span>
                    ))}
                    {(slot.filled as Experience).tags.length > 3 && (
                      <span className={styles.tagPillMuted}>
                        +{(slot.filled as Experience).tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className={styles.emptyTitle}>{slot.title}</h3>
                {canDrop && (
                  <p className={styles.emptyHint}>
                    Drag a {
                      slot.type === 'Keynote'
                        ? 'keynote'
                        : slot.type === 'Experience'
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
              className={styles.removeButton}
              aria-label="Remove item"
            >
              <X className={styles.removeIcon} />
            </button>
          )}
        </div>
      </div>
      {/* Gradient overlay for filled slots */}
      {slot.filled && (
        <div className={`${styles.slotOverlay} ${
          slot.filledType === 'keynote'
            ? styles.slotOverlayKeynote
            : styles.slotOverlayExperience
        }`} />
      )}
    </div>
  );
}

const defaultAgenda:AgendaItem[] = [
  { id: '1', time: '9:00 AM', title: 'Welcome & Registration', type: 'Session' },
  { id: '2', time: '9:30 AM', title: 'Introduction', type: 'Session' },
  { id: '3', time: '10:00 AM', title: 'Keynote Slot', type: 'Keynote' },
  { id: '4', time: '11:00 AM', title: 'Ideation Workshop', type: 'Session' },
  { id: '5', time: '12:00 PM', title: 'Lunch Break', type: 'Session' },
  { id: '6', time: '1:00 PM', title: 'Flexible Slot', type: 'Open Slot' },
  { id: '7', time: '2:00 PM', title: 'Hands-on Build Session', type: 'Session' },
  { id: '8', time: '2:30 PM', title: 'Presentation & Demo', type: 'Session' },
  { id: '9', time: '3:00 PM', title: 'Closing Remarks', type: 'Session' },
]

const STORAGE_KEY = 'agenda-builder-state';

export default function AgendaBuilderPage() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);

  const [keynotes, setKeynotes] = useState<Keynote[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [usedItems, setUsedItems] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'keynotes' | 'experiences'>('keynotes');
  const [selectedOffering, setSelectedOffering] = useState<{ id: string; title: string; type: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const saveStateToStorage = (state: {
    agenda: AgendaItem[];
    usedItems: string[];
    activeTab: 'keynotes' | 'experiences';
    selectedOffering: { id: string; title: string; type: string } | null;
  }) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to sessionStorage:', error);
    }
  };

  const loadStateFromStorage = () => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        return parsedState;
      }
    } catch (error) {
      console.error('Failed to load state from sessionStorage:', error);
    }
    return null;
  };

  useEffect(() => {
    // Load saved state first
    const savedState = loadStateFromStorage();
    if (savedState) {
      if (savedState.agenda && Array.isArray(savedState.agenda) && savedState.agenda.length > 0) {
        setAgenda(savedState.agenda);
      }
      setUsedItems(new Set(savedState.usedItems || []));
      setActiveTab(savedState.activeTab || 'keynotes');
      setSelectedOffering(savedState.selectedOffering || null);
    } else {
      setAgenda(defaultAgenda);
    }

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
    
    // Mark as initialized after state restoration
    setIsInitialized(true);
  }, []);

  // Only save state after initial load is complete
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    saveStateToStorage({
      agenda,
      usedItems: Array.from(usedItems),
      activeTab,
      selectedOffering,
    });
  }, [agenda, usedItems, activeTab, selectedOffering, isInitialized]);

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
      (draggedType === 'keynote' && (slotType === 'Keynote' || slotType === 'Open Slot')) ||
      (draggedType === 'experience' && (slotType === 'Experience' || slotType === 'Open Slot'))
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

  const formatSlackExport = () => {
    const offeringTitle = selectedOffering ? selectedOffering.title : 'AI Centre Experience';
    let slackText = `🎯 ${offeringTitle} - Agenda\n\n`;
    
    agenda.forEach(slot => {
      const timeEmoji = '⏰';
      const slotEmoji = slot.type === 'Session' ? '📌' : 
                       slot.type === 'Keynote' ? '🎤' : 
                       slot.type === 'Experience' ? '🎮' : '✨';
      
      slackText += `${timeEmoji} ${slot.time} ${slotEmoji}\n`;
      
      if (slot.filled) {
        slackText += `   ${slot.filled.title}\n`;
        
        if (slot.filledType === 'keynote') {
          const keynote = slot.filled as Keynote;
          slackText += `   _Presenter: ${keynote.presenter}_\n`;
          if (keynote.topics && keynote.topics.length > 0) {
            slackText += `   _Topics: ${keynote.topics.slice(0, 3).join(', ')}_\n`;
          }
        } else if (slot.filledType === 'experience') {
          const experience = slot.filled as Experience;
          slackText += `   _${experience.type.charAt(0).toUpperCase() + experience.type.slice(1)} Experience_\n`;
          if (experience.tags && experience.tags.length > 0) {
            slackText += `   _Tags: ${experience.tags.slice(0, 3).join(', ')}_\n`;
          }
        }
      } else if (slot.type !== 'Session') {
        const emptySlotType = slot.type === 'Keynote' ? 'Keynote Slot' : 
                             slot.type === 'Experience' ? 'Experience Slot' : 'Open Slot';
        slackText += `   ${slot.title}\n`;
        slackText += `   _${emptySlotType} - Available for booking_\n`;
      } else {
        slackText += `   ${slot.title}\n`;
      }
      slackText += '\n';
    });

    // Add summary
    const filledSlots = agenda.filter(slot => slot.filled);
    const emptySlots = agenda.filter(slot => !slot.filled && slot.type !== 'Session');
    const keynoteCount = filledSlots.filter(slot => slot.filledType === 'keynote').length;
    const experienceCount = filledSlots.filter(slot => slot.filledType === 'experience').length;

    slackText += '📊 Summary\n';
    slackText += `• ${keynoteCount} Keynote${keynoteCount !== 1 ? 's' : ''} scheduled\n`;
    slackText += `• ${experienceCount} Experience${experienceCount !== 1 ? 's' : ''} scheduled\n`;
    if (emptySlots.length > 0) {
      slackText += `• ${emptySlots.length} Open slot${emptySlots.length !== 1 ? 's' : ''} remaining\n`;
    }

    return slackText;
  };

  const handleCopyToClipboard = async () => {
    try {
      const exportText = formatSlackExport();
      await navigator.clipboard.writeText(exportText);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = formatSlackExport();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const getAgenda = async (id: string) => {
    try {
      if (!id)
        return defaultAgenda;

      const response = await fetch(`/api/agendas?id=${id}`);
      if (!response.ok) {
        console.error(`Failed to fetch from agendas: `, response.statusText);
        return defaultAgenda;
      }
      const json = await response.json();
      return json.data;
    } catch {
      return defaultAgenda;
    }
  }

  const handleOfferingChange = async (e:any) => {
    const id = e.target.value;
    const selected = workshops.find(w => w.id === id);
    setSelectedOffering(selected ? { id: selected.id, title: selected.title, type: 'workshop' } : null);
    if (selected) {
      const newAgenda = await getAgenda(selected.agendaId || "");
      setSelectedOffering({ id: selected.id, title: selected.title, type: 'workshop' });
      setAgenda(newAgenda);
    } else {
      setSelectedOffering(null);
      setAgenda(defaultAgenda);
    }
  }

  return (
    <main className={styles.page}>
      <Navigation />

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Hero Section */}
        <section className={`section-padding ${styles.hero}`}>
          <div className="container-max">
            <div className={styles.heroHead}>
              <h1 className={styles.heroTitle}>
                Agenda Builder
              </h1>
              <p className={styles.heroSubtitle}>
                Customize your AI Centre experience by dragging keynotes and experiences into flexible time slots
              </p>
              <button
                onClick={handleCopyToClipboard}
                className={styles.exportButton}
              >
                {isCopied ? (
                  <>
                    <Check className={styles.exportIcon} />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className={styles.exportIcon} />
                    Export for Slack
                  </>
                )}
              </button>
            </div>

            <div className={styles.mainGrid}>
              {/* Agenda Timeline */}
              <div className={styles.timelineCol}>
                <div className={`glass-card ${styles.timelineCard}`}>

                  {/* Title as Dropdown */}
                  <div className={styles.offeringRow}>
                    <span className={styles.offeringDot}></span>
                    <select
                      value={selectedOffering?.id || ''}
                      onChange={async (e) => await handleOfferingChange(e)}
                      className={styles.offeringSelect}
                      style={{ paddingLeft: '0' }}
                    >
                      <option value="">Select a Standard Offering</option>
                      {workshops.map(workshop => (
                        <option key={workshop.id} value={workshop.id}>
                          {workshop.title}
                        </option>
                      ))}
                    </select>
                    <div className={styles.offeringChevronWrap}>
                      <ChevronDown className={styles.offeringChevron} />
                    </div>
                  </div>
                  {agenda.length > 0 && (
                    <div className={styles.agendaList}>
                      <span>Use this agenda as a starting point and we look forward to collaborating with you to finalise it.</span>
                      {agenda.map(slot => (
                        <DroppableSlot
                          key={slot.id}
                          slot={slot}
                          onRemove={handleRemove}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Palette with Tabs */}
              <div className={`glass-card ${styles.paletteCard}`}>
                {/* Tab Navigation */}
                <div className={styles.tabRow}>
                  <button
                    onClick={() => setActiveTab('keynotes')}
                    className={`${styles.tabButton} ${
                      activeTab === 'keynotes' ? styles.tabButtonActiveBlue : ''
                    }`}
                  >
                    <span className={styles.tabButtonInner}>
                      <span className={`${styles.tabDot} ${styles.tabDotBlue}`}></span>
                      Keynotes
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('experiences')}
                    className={`${styles.tabButton} ${
                      activeTab === 'experiences' ? styles.tabButtonActiveGreen : ''
                    }`}
                  >
                    <span className={styles.tabButtonInner}>
                      <span className={`${styles.tabDot} ${styles.tabDotGreen}`}></span>
                      Experiences
                    </span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                  {activeTab === 'keynotes' ? (
                    <div className={styles.itemList}>
                      {keynotes.length === 0 ? (
                        <div className={styles.loadingBlock}>
                          <div className={`${styles.spinnerSm} ${styles.spinnerBlue}`}></div>
                          <p className={styles.loadingText}>Loading keynotes...</p>
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
                    <div className={styles.itemList}>
                      {experiences.length === 0 ? (
                        <div className={styles.loadingBlock}>
                          <div className={`${styles.spinnerSm} ${styles.spinnerGreen}`}></div>
                          <p className={styles.loadingText}>Loading experiences...</p>
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
              className={`${styles.overlayCard} ${
                activeId.startsWith('keynote')
                  ? styles.overlayKeynote
                  : styles.overlayExperience
              }`}
              style={{ opacity: 1, position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
            >
              <h3 className={styles.overlayTitle}>{getActiveItem()!.title}</h3>
              <p className={styles.overlaySubtitle}>
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