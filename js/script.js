function mapRange(min, max, progress) {
  return min + (max - min) * progress;
}

function scrollProgress(start, heightFactor = 0.65) {
  let offset = window.scrollY - start;
  let maxOffset = window.innerHeight * heightFactor;
  return Math.min(1, Math.max(0, offset / maxOffset));
}

function getDocumentOffsetPosition(el) {
  let top = 0,
    left = 0;
  while (el !== null) {
    top += el.offsetTop;
    left += el.offsetLeft;
    el = el.offsetParent;
  }
  return { top, left };
}

// Timeline updating
const durationLabel = document.querySelector('#duration');
const recordingClip = document.querySelector('.clip#recording');

function updateTimeline() {
  const minDuration = 5;
  const maxDuration = 20;
  const minPercentage = 10;
  const maxPercentage = 50;
  const minOffset = 0;
  const maxOffset = window.innerHeight * 0.65;
  const progress = scrollProgress(0);

  const duration = Math.floor(mapRange(minDuration, maxDuration, progress));
  const width = mapRange(minPercentage, maxPercentage, progress);
  durationLabel.innerHTML = `${duration}s`;
  recordingClip.style.width = `${width}%`;

  if (progress < 1) {
    recordingClip.classList.add('recording');
  } else {
    recordingClip.classList.remove('recording');
  }
}

const editorClips = document.querySelectorAll('.ui .editor .clip');
const clipCount = editorClips.length;
const editor = document.querySelector('#editor');

function updateEditor() {
  const minIndex = 0;
  const maxIndex = clipCount - 1;
  const offset = getDocumentOffsetPosition(editor).top - window.innerHeight;
  const progress = scrollProgress(offset);
  const index = maxIndex - Math.floor(mapRange(minIndex, maxIndex, progress));
  console.log(index);
  for (var clipIndex = 0; clipIndex < clipCount; clipIndex++) {
    const clip = editorClips[clipIndex];
    if (clipIndex == index) {
      clip.classList.add('selected');
    } else {
      clip.classList.remove('selected');
    }
  }
}

function updateScrollHandler() {
  updateTimeline();
  updateEditor();
}

document.addEventListener('scroll', updateScrollHandler);
document.addEventListener('resize', updateScrollHandler);
updateScrollHandler();
