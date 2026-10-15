/**
 * ExperienceVideo — Cloudinary-hosted AI Centre tour video on the
 * Experiences hero, between the heading and the section-filter pills.
 *
 * Shows a poster frame with a play button overlay; clicking plays the
 * video inline with native controls.
 */

'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import styles from './ExperienceVideo.module.css';

const VIDEO_SRC =
  'https://res.cloudinary.com/iboost/video/upload/v1792060088/AI_Centre_Tour.mp4';
const POSTER_SRC =
  'https://res.cloudinary.com/iboost/video/upload/q_auto/v1792060088/AI_Centre_Tour.jpg';

export default function ExperienceVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className={styles.wrapper}>
      <video
        ref={videoRef}
        className={styles.video}
        poster={POSTER_SRC}
        controls={playing}
        controlsList="nodownload"
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      {!playing && (
        <button
          type="button"
          className={styles.playButton}
          onClick={handlePlay}
          aria-label="Play the AI Centre tour video"
        >
          <Play className={styles.playIcon} fill="currentColor" />
        </button>
      )}
    </div>
  );
}
