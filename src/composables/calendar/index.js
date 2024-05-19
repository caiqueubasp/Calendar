import { ref, computed } from 'vue';

export default function useCalendar() {
  // Dados do calendário
  const events = ref([]);
  const loading = ref(false);
  const lastEventColor = ref(null);

  const eventBackgroundColorOptions = [
    '#FFFF62',
    '#A97AC2',
    '#37B98A',
    '#2D78E8',
    '#5A59A4',
    '#000000',
    '#C83737',
    '#FFA500',
    '#FFD700',
    '#008000',
    '#FF00FF',
    '#800080',
    '#00FFFF',
    '#008080',
    '#0000FF',
    '#000080',
    '#FF0000',
    '#800000',
    '#00FF00',
    '#FFFFFF',
    '#C0C0C0',
    '#808080',
    '#FFFF00',
    '#00FF00',
  ];

  const fetchEvents = async ({ title, start, end }) => {
    setLoading(true);
    await fetch('http://worldtimeapi.org/api/timezone/America/Sao_Paulo')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.datetime);

        addEvent({
          title: title,
          start: start,
          end: end,
        });

        addEvent({
          title: `API: ${data.datetime.split('T')[0]}`,
          start: data.datetime,
          end: data.datetime,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const parseEvents = (event) => {
    return {
      id: buildEventId(),
      title: event.title,
      start: event?.start,
      end: event?.end,
      allDay: event?.allDay,
      backgroundColor: buildEventColor(),
      textColor: buildTextColor(),
      display: 'block',
      borderColor: 'transparent',
      extendedProps: {},
    };
  };

  const buildEventColor = () => {
    const color =
      eventBackgroundColorOptions[
        Math.floor(Math.random() * eventBackgroundColorOptions.length)
      ];

    lastEventColor.value = color;

    return color;
  };

  const buildTextColor = () => {
    const blackTextMatchs = [
      '#FFFF62',
      '#FFD700',
      '#FFFF00',
      '#FFFFFF',
      '#C0C0C0',
      '#808080',
      '#FFFF00',
    ];
    const currentColor = lastEventColor.value;

    if (blackTextMatchs.includes(currentColor)) {
      return 'rgba(0, 0, 0, 0.6)';
    }

    return '#FFFFFF';
  };

  // Adicionar um evento ao calendário
  const addEvent = (event) => {
    const parsedEvent = parseEvents(event);
    events.value.push(parsedEvent);
  };

  // Remover um evento do calendário
  const removeEvent = (event) => {
    const eventIndex = events.value.findIndex((e) => e.id === event.id);
    events.value.splice(eventIndex, 1);
  };

  const clearCalendar = () => {
    events.value.splice(0, events.value.length);
  };

  const buildEventId = () => {
    return Math.random().toString(36).slice(2, 11);
  };

  const setLoading = (value) => {
    loading.value = value;
  };

  return {
    events: computed(() => events.value),
    loading: computed(() => loading.value),
    fetchEvents,
    setLoading,
    addEvent,
    removeEvent,
    clearCalendar,
  };
}
