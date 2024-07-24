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

function getScreenHeight() {
  return window.innerHeight;
}

function scrollProgressForElement(
  element,
  fractionalPadding = 0.2,
  offset = 0.15
) {
  let { top, _ } = getDocumentOffsetPosition(element);
  const screenHeight = getScreenHeight();
  const elementCenter = top + element.offsetHeight / 2;
  const windowPadding = screenHeight * (fractionalPadding / 2);
  const windowOffset = screenHeight * offset;
  const padding = windowPadding + element.offsetHeight / 2;
  const scrollOffset = window.scrollY + (screenHeight - padding) + windowOffset;
  const scrollArea = screenHeight - padding * 2;
  const relativeScroll = scrollOffset - elementCenter;
  const visibility = relativeScroll / scrollArea;
  return visibility;
}

// Timeline updating
const timelineElement = document.querySelector('#timeline');
const durationLabel = timelineElement.querySelector('#duration');
const recordingClip = timelineElement.querySelector('.clip#recording');
const timelineShadow = timelineElement.querySelector('.shadow');

function updateTimeline() {
  const minDuration = 11;
  const maxDuration = 20;
  const minPercentage = 10;
  const maxPercentage = 50;
  const minOffset = 0;
  const maxOffset = window.innerHeight * 0.65;
  const progress = scrollProgressForElement(timelineElement);

  if (progress < 1) {
    recordingClip.classList.add('recording');
  } else {
    recordingClip.classList.remove('recording');
  }

  if (progress > 1 || progress < 0) {
    return;
  }

  const duration = Math.floor(mapRange(minDuration, maxDuration, progress));
  const width = mapRange(minPercentage, maxPercentage, progress);
  durationLabel.innerHTML = `${duration}s`;
  recordingClip.style.width = `${width}%`;
  timelineShadow.style.width = `${50 + width}%`;
}

const exporter = document.querySelector('#export');
const exportProgressBar = exporter.querySelector('#export-progress');
const exportLabel = exporter.querySelector('.export p');
const exportBar = exporter.querySelector('.export .bar');
const appsContainer = exporter.querySelector('.apps');
const apps = appsContainer.querySelectorAll('img');

function updateExportBar(progress) {
  const width = mapRange(30, 100, progress);
  exportProgressBar.style.width = `${width}%`;
  const isDone = progress >= 1;
  if (isDone) {
    exportLabel.innerHTML = '&check; Done!';
    exportProgressBar.classList.add('done');
  } else {
    exportLabel.innerHTML = 'Exporting your video&hellip;';
    exportProgressBar.classList.remove('done');
  }
}

function updateApps(progress) {
  let appIndex = Math.floor(mapRange(0, apps.length - 1, progress));
  for (var index = 0; index < apps.length; index++) {
    const app = apps[index];
    if (index <= appIndex) {
      app.classList.add('popped');
    } else {
      app.classList.remove('popped');
    }
  }
}

function updateExporter() {
  const appOffset = 0.6;
  const exportPeriod = 0.5;
  const progress = scrollProgressForElement(exporter, 0.1, 0.1);
  if (progress < appOffset) {
    exportLabel.style.opacity = '1';
    exportBar.style.opacity = '1';
  } else {
    exportLabel.style.opacity = '0.1';
    exportBar.style.opacity = '0.1';
  }
  const exportProgress = normalizedClamp(progress / exportPeriod);
  updateExportBar(exportProgress);
  const appProgress = (progress - appOffset) / (1 - appOffset);
  updateApps(appProgress * 2);
}

const editorClips = document.querySelectorAll('.ui .editor .clip');
const clipCount = editorClips.length;
const editor = document.querySelector('#editor');
const editorElement = document.querySelector('#editor .editor');
const noTrimYet = document.body.classList.contains('notrimyet');

function updateEditor() {
  const minIndex = 0;
  const maxIndex = clipCount + 2;
  const progress = scrollProgressForElement(editor);
  if (progress > 1 || progress < 0) {
    return;
  }

  const mappedIndex = Math.ceil(mapRange(minIndex, maxIndex, progress)) + 1;

  const index = maxIndex - mappedIndex;

  if (index == -1 && !noTrimYet) {
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

const projects = document.querySelector('#projects');
const projectsElement = projects.querySelector('.centered');

function updateProjects() {
  const progress = scrollProgressForElement(projects, -0.2, 0);
  if (progress > 1 || progress < 0) {
    return;
  }
  const percentage = mapRange(0, 100, progress);
  projectsElement.style.backgroundPosition = `center ${percentage}%`;
}

const privacy = document.querySelector('#privacy');
const clouds = privacy.querySelectorAll('.cloud');

function updatePrivacy() {
  const progress = scrollProgressForElement(privacy, -0.4, 0);
  if (progress > 1 || progress < 0) {
    return;
  }
  const offset = mapRange(50, 0, progress);
  const multipliedOffset = mapRange(70, -20, progress);
  clouds.forEach((cloud, index) => {
    const translation = index > 1 ? multipliedOffset : offset;
    cloud.style.transform = `translateX(${translation}%`;
  });
}

function updateScrollHandler() {
  updateTimeline();
  updateEditor();
  updateExporter();
  updateProjects();
  updatePrivacy();
}

document.addEventListener('scroll', updateScrollHandler);
document.addEventListener('resize', updateScrollHandler);
updateScrollHandler();

// Testimonials
const testimonials = document.querySelectorAll(
  '#testimonials .testimonial .review > p'
);
testimonials.forEach(testimonial => {
  const moreLink = testimonial.querySelector('a.link-more');
  const lessLink = testimonial.querySelector('a.link-less');
  if (moreLink) {
    moreLink.addEventListener('click', event => {
      testimonial.classList.add('expanded');
      event.preventDefault();
    });
  }
  if (lessLink) {
    lessLink.addEventListener('click', event => {
      testimonial.classList.remove('expanded');
      event.preventDefault();
    });
  }
});
