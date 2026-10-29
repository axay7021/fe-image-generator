const styles = ['Studio portrait', 'Editorial look', 'Natural light'];
const root = document.getElementById('styles');
styles.forEach((name, i) => {
  const b = document.createElement('button');
  b.textContent = name;
  b.className = 'chip style' + (i === 0 ? ' active' : '');
  b.setAttribute('aria-pressed', String(i === 0));
  b.onclick = () => {
    root.querySelectorAll('button').forEach((el) => {
      el.classList.remove('active');
      el.setAttribute('aria-pressed', 'false');
    });
    b.classList.add('active');
    b.setAttribute('aria-pressed', 'true');
    document.getElementById('after').src = './sample-' + (i + 2) + '.jpg';
  };
  root.append(b);
});
document.getElementById('compare').oninput = (event) => {
  document.getElementById('after-wrap').style.clipPath = 'inset(0 0 0 ' + event.target.value + '%)';
};
