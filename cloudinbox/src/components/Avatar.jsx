import { initials } from '../utils/format';
const HUES = [221, 262, 172, 24, 340, 199, 142];
export default function Avatar({ name, size = 32 }) {
  const hue = HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
  return (
    <span className="avatar" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${hue} 70% 94%)`, color: `hsl(${hue} 55% 32%)` }}>
      {initials(name)}
    </span>
  );
}
