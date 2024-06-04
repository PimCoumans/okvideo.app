function mapRange(min, max, progress) {
  return min + (max - min) * progress;
}

function normalizedClamp(number) {
  return Math.min(1, Math.max(0, number));
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

function scrollProgressForElement(element, fractionalPadding = 0.2) {
  let { top, _ } = getDocumentOffsetPosition(element);
  let elementCenter = top + element.offsetHeight / 2;
  let windowPadding = window.innerHeight * (fractionalPadding / 2);
  let padding = windowPadding + element.offsetHeight / 2;
  let scrollOffset = window.scrollY + (window.innerHeight - padding);
  let scrollArea = window.innerHeight - padding * 2;
  let relativeScroll = scrollOffset - elementCenter;
  let visibility = relativeScroll / scrollArea;
  return normalizedClamp(visibility);
}

// Timeline updating
const timelineElement = document.querySelector('#timeline');
const durationLabel = document.querySelector('#duration');
const recordingClip = document.querySelector('.clip#recording');

function updateTimeline() {
  const minDuration = 5;
  const maxDuration = 20;
  const minPercentage = 10;
  const maxPercentage = 50;
  const minOffset = 0;
  const maxOffset = window.innerHeight * 0.65;
  const progress = scrollProgressForElement(timelineElement);

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
  const progress = scrollProgressForElement(editor);
  const index = maxIndex - Math.floor(mapRange(minIndex, maxIndex, progress));

  for (var clipIndex = 0; clipIndex < clipCount; clipIndex++) {
    const clip = editorClips[clipIndex];
    if (clipIndex == index) {
      clip.classList.add('selected');
    } else {
      clip.classList.remove('selected');
    }
  }
}

const exporter = document.querySelector('#export');
const exportProgress = document.querySelector('#export-progress');
const exportLabel = document.querySelector('#export .export p');

function updateExporter() {
  const progress = scrollProgressForElement(exporter);
  const width = progress * 100;
  exportProgress.style.width = `${width}%`;
  const isDone = progress == 1;
  exportLabel.innerHTML = isDone
    ? '&check; Done!'
    : 'Exporting your video&hellip;';
}

function updateScrollHandler() {
  updateTimeline();
  updateEditor();
  updateExporter();
}

document.addEventListener('scroll', updateScrollHandler);
document.addEventListener('resize', updateScrollHandler);
updateScrollHandler();
