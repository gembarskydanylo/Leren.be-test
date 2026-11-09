// LerenBe LIFE stories: interactive situations from real life in Belgium. Ready stories open in learn-life-story.html;
// the rest is the roadmap shown as «скоро» (stage 1, 2, 3 of the plan). The fence scenario keeps its own page.
import {firstDay} from './first-day.mjs?v=2';

export const STORIES = [firstDay];
export const storyById = id => STORIES.find(s => s.id === id) || null;

export const ROADMAP = [
 {id: 'first-day', icon: '🏡', title: 'Перший день у Бельгії', level: 'A1', stage: 1, ready: true},
 {id: 'supermarket', icon: '🛒', title: 'Покупки в супермаркеті', level: 'A1', stage: 1},
 {id: 'town-hall', icon: '🏛️', title: 'Реєстрація в комуні', level: 'A1–A2', stage: 1},
 {id: 'first-workday', icon: '👷', title: 'Перший день на роботі', level: 'A1–A2', stage: 1},
 {id: 'fence', icon: '🪵', title: 'Будівництво паркану', level: 'A1–A2', stage: 1, ready: true, href: './learn-life.html'},
 {id: 'doctor', icon: '🩺', title: 'Візит до лікаря', level: 'A1–A2', stage: 2},
 {id: 'pharmacy', icon: '💊', title: 'В аптеці', level: 'A1–A2', stage: 2},
 {id: 'bus', icon: '🚌', title: 'Поїздка автобусом', level: 'A1', stage: 2},
 {id: 'school', icon: '🏫', title: 'Розмова в школі', level: 'A1–A2', stage: 2},
 {id: 'repair', icon: '🔧', title: 'Ремонт у будинку', level: 'A1–A2', stage: 2},
 {id: 'renting', icon: '🏠', title: 'Оренда квартири', level: 'A2', stage: 3},
 {id: 'neighbours', icon: '☕', title: 'Розмова із сусідами', level: 'A1', stage: 3},
 {id: 'bank', icon: '🏦', title: 'Відкриття банківського рахунку', level: 'A2', stage: 3},
 {id: 'car', icon: '🚗', title: 'Автомобіль зламався', level: 'A2', stage: 3},
 {id: 'solar', icon: '☀️', title: 'Монтаж сонячних панелей', level: 'A2–B1', stage: 3}
];
