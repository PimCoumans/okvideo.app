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

function scrollProgressForElement(
  element,
  fractionalPadding = 0.2,
  offset = 0.15
) {
  let { top, _ } = getDocumentOffsetPosition(element);
  let elementCenter = top + element.offsetHeight / 2;
  let windowPadding = window.innerHeight * (fractionalPadding / 2);
  let windowOffset = window.innerHeight * offset;
  let padding = windowPadding + element.offsetHeight / 2;
  let scrollOffset =
    window.scrollY + (window.innerHeight - padding) + windowOffset;
  let scrollArea = window.innerHeight - padding * 2;
  let relativeScroll = scrollOffset - elementCenter;
  let visibility = relativeScroll / scrollArea;
  return visibility;
}

// Timeline updating
const timelineElement = document.querySelector('#timeline');
const durationLabel = document.querySelector('#duration');
const recordingClip = document.querySelector('.clip#recording');
const timelineShadow = document.querySelector('#timeline .shadow');

function updateTimeline() {
  const minDuration = 5;
  const maxDuration = 20;
  const minPercentage = 10;
  const maxPercentage = 50;
  const minOffset = 0;
  const maxOffset = window.innerHeight * 0.65;
  const progress = scrollProgressForElement(timelineElement);
  if (progress > 1 || progress < 0) {
    return;
  }

  const duration = Math.floor(mapRange(minDuration, maxDuration, progress));
  const width = mapRange(minPercentage, maxPercentage, progress);
  durationLabel.innerHTML = `${duration}s`;
  recordingClip.style.width = `${width}%`;
  timelineShadow.style.width = `${50 + width}%`;

  if (progress < 1) {
    recordingClip.classList.add('recording');
  } else {
    recordingClip.classList.remove('recording');
  }
}

const editorClips = document.querySelectorAll('.ui .editor .clip');
const clipCount = editorClips.length;
const editor = document.querySelector('#editor');
const editorElement = document.querySelector('#editor .editor');

function updateEditor() {
  const minIndex = -1;
  const maxIndex = clipCount - 1;
  const progress = scrollProgressForElement(editor);
  if (progress > 1 || progress < 0) {
    return;
  }

  const mappedIndex = Math.ceil(mapRange(minIndex, maxIndex, progress)) + 1;

  const index = maxIndex - mappedIndex;

  if (index == -1) {
    editorElement.classList.add('open');
  } else {
    editorElement.classList.remove('open');
  }

  for (var clipIndex = 0; clipIndex < clipCount; clipIndex++) {
    const clip = editorClips[clipIndex];
    if (clipIndex == Math.max(0, index)) {
      clip.classList.add('selected');
    } else {
      clip.classList.remove('selected');
    }
  }
}

const exporter = document.querySelector('#export');
const exportProgress = exporter.querySelector('#export-progress');
const exportLabel = exporter.querySelector('.export p');

function updateExporter() {
  const progress = normalizedClamp(scrollProgressForElement(exporter));
  const width = progress * 100;
  exportProgress.style.width = `${width}%`;
  const isDone = progress == 1;
  if (isDone) {
    exportLabel.innerHTML = '&check; Done!';
    exportProgress.classList.add('done');
  } else {
    exportLabel.innerHTML = 'Exporting your video&hellip;';
    exportProgress.classList.remove('done');
  }
}

const projects = document.querySelector('#projects');
const projectsElement = projects.querySelector('.centered');

function updateProjects() {
  const progress = scrollProgressForElement(projects, -0.2, 0);
  if (progress > 1 || progress < 0) {
    return;
  }
  const percentage = mapRange(15, 90, progress);
  projectsElement.style.backgroundPosition = `center ${percentage}%`;
}

function updateScrollHandler() {
  updateTimeline();
  updateEditor();
  updateExporter();
  updateProjects();
}

document.addEventListener('scroll', updateScrollHandler);
document.addEventListener('resize', updateScrollHandler);
updateScrollHandler();
