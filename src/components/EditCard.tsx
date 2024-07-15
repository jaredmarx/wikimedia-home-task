"use client";

import React, { useEffect, useState } from 'react';
import styles from './EditCard.module.css';
import { Edit } from '../utils/type';
import { fetchDamagingScore } from '../services/revscoring';
import { fetchRenderedDiff } from '../services/mediaWiki';

interface EditCardProps {
    edit: Edit;
    onMarkAsSeen: () => void;
}

const EditCard: React.FC<EditCardProps> = ({ edit, onMarkAsSeen }) => {
    const [damagingScore, setDamagingScore] = useState<number | null>(null);
    const [renderedDiff, setRenderedDiff] = useState<string>('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const score = await fetchDamagingScore(edit.id);
                setDamagingScore(score);

                const diff = await fetchRenderedDiff(edit.title, edit.id);
                setRenderedDiff(diff.compare['*']);
            } catch (error) {
            }
        };

        fetchMetadata();

    }, [edit.id, edit.title]);

    return (
        <div className={styles.editCard} style={{ borderColor: damagingScore && damagingScore > 0.5 ? 'red' : 'inherit' }}>
            <h3>{edit.title}</h3>
            <p>{edit.comment}</p>
            <p><strong>User:</strong> {edit.user}</p>
            <p><strong>Domain:</strong> {edit?.meta.domain}</p>
            <p><strong>Namespace:</strong> {edit.namespace}</p>
            <p><strong>Revision:</strong> {edit.id}</p>
            <button onClick={onMarkAsSeen}>Mark as Seen</button>
            {damagingScore !== null && <p className={styles.vandalism}>Damaging Score: {(damagingScore * 100).toFixed(2)}%</p>}
            {renderedDiff && <div className={styles.diff} dangerouslySetInnerHTML={{ __html: renderedDiff }} />}
        </div>
    );
};

export default EditCard;
