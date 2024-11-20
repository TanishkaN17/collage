import React, {useState, lazy, useEffect} from 'react';
import { IconCircleArrowLeft } from '@tabler/icons-react';
import { ActionIcon, rem } from '@mantine/core';
import '../CSS/classPreview.css';
import '../CSS/course_tag.css';
const Preview = lazy(() => import('./Preview'))
const SuggestedConnections = lazy(() => import('./SuggestedConnections'))
const ChatBox = lazy(() => import('./ChatBox'))

const IndividualCourse = ({courseId, handleBack, refetch, handleExploreMore}) => {
    return (
        <div className="full-page">
            <div className="course-grid">
                <div className="back-button">
                    <ActionIcon variant="subtle" aria-label="Back" size="xl" onClick={() => handleBack()}>
                        <IconCircleArrowLeft stroke={1} color="#242424" style={{ width: rem(80), height: rem(80) }}/>
                    </ActionIcon>
                </div>
                <Preview courseId={courseId} refetch={refetch}/>
                <SuggestedConnections courseId={courseId} handleExploreMore={handleExploreMore}/>
                <ChatBox courseId={courseId}/>
            </div>
        </div>
    )
}

export default IndividualCourse