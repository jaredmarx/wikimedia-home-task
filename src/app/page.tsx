"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import eventStream from '../services/eventStream';
import EditCard from '../components/EditCard';
import FilterControls from '../components/FilterControls';
import styles from './index.module.css';
import { Edit, Filters } from '../utils/type';
import { VariableSizeList as List } from 'react-window';
import { requestNotificationPermission, notifyUser, playSound } from '../services/notification';
import { saveFilters, loadFilters } from '../services/filters';

const Home: React.FC = () => {
    const [edits, setEdits] = useState<Edit[]>([]);
    const [seenEdits, setSeenEdits] = useState<Set<number>>(new Set());
    const [filters, setFilters] = useState<any>(loadFilters());
    const [paused, setPaused] = useState(false);
    const batchRef = useRef<Edit[]>([]);
    const listRef = useRef<List>(null);

    useEffect(() => {
        requestNotificationPermission().then(r => console.log(r));

        if (typeof window !== 'undefined') {
            const handleEvent = (event: any) => {
                batchRef.current.push(event);
            };

            eventStream.addListener(handleEvent);
            const intervalId = setInterval(() => {
                if (batchRef.current.length > 0) {
                    setEdits(prevEdits => [...batchRef.current, ...prevEdits].slice(0, 100));
                    batchRef.current = [];
                    if (listRef.current) {
                        listRef.current.resetAfterIndex(0, true);
                    }

                    // Check for events of interest and trigger notifications and sound
                    batchRef.current.forEach((edit) => {
                        if (filters.domain && edit.meta.domain.includes(filters.domain)) {
                            notifyUser(`Edit on ${edit.title}`, { body: edit.comment }); // Trigger notification
                            playSound(); // Trigger sound
                        }
                    });
                }
            }, 1000);

            return () => {
                eventStream.removeListener(handleEvent);
                clearInterval(intervalId);
            };
        }
    }, [filters]);

    const markAsSeen = (id: number) => {
        setSeenEdits(prevSeenEdits => {
            const newSet = new Set(prevSeenEdits);
            newSet.add(id);
            return newSet;
        });
    };


    // Filter the edits based on the current filters and seen edits
    const filteredEdits = edits.filter(edit => {
        return (
            !seenEdits.has(edit.id) &&
            (!filters.domain || edit.meta.domain.includes(filters.domain)) &&
            (!filters.namespace || edit.namespace.toString() === filters.namespace) &&
            (!filters.user || edit.user.includes(filters.user))
        );
    });

    const togglePause = () => {
        if (paused) {
            eventStream.resume();
        } else {
            eventStream.pause();
        }
        setPaused(!paused);
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        saveFilters(newFilters);
    };

    const getItemSize = useCallback(() => 300, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Wikimedia Event Monitor</h1>
            <FilterControls filters={filters} onFilterChange={handleFilterChange} />
            <button className={styles.button} onClick={togglePause}>{paused ? 'Resume' : 'Pause'} Stream</button>
            <button className={styles.button} onClick={() => setSeenEdits(new Set())}>Clear Seen Items</button>
            <div className={styles.edits}>
                <List
                    ref={listRef}
                    height={600}
                    itemCount={filteredEdits.length}
                    itemSize={getItemSize}
                    width={'100%'}
                >
                    {({ index, style }) => {
                        const edit = filteredEdits[index];
                        return (
                            <div key={edit.id} style={{ ...style, display: 'flex', justifyContent: 'center' }}>
                                <EditCard edit={edit} onMarkAsSeen={() => markAsSeen(edit.id)} />
                            </div>
                        );
                    }}
                </List>
            </div>
        </div>
    );
};

export default Home;
