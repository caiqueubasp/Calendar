<template>
  <button @click="clear">Limpar TODOS os eventos</button>
  <FullCalendar :options="calendarOptions">
    <template v-slot:eventContent="arg">
      <b>{{ arg.event.title }}</b>
    </template>
  </FullCalendar>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import BRLocale from '@fullcalendar/core/locales/pt-br';

import useCalendar from '@/composables/calendar/index.js';

import { watch } from 'vue';

export default {
  name: 'CalendarGrid',
  components: {
    FullCalendar,
  },
  setup() {
    const {
      events,
      loading,
      fetchEvents,
      addEvent,
      removeEvent,
      clearCalendar,
    } = useCalendar();

    const calendarOptions = {
      locale: BRLocale,
      timeZone: 'America/Sao_Paulo',
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: events.value,
      fixedWeekCount: false,
      editable: true,
      dateClick: (info) => {
        console.log('dateClick', info);

        addEvent({
          title: `Evento: ${info.dateStr}`,
          start: info.dateStr,
          end: info.dateStr,
          allDay: true,
        });
      },
      eventClick: (info) => {
        console.log('eventClick', info);
        deleteEvent(info.event);
      },
      eventChange: (info) => {
        console.log('eventChange', info);
      },
      datesSet: async (info) => {
        console.log('datesSet', info);

        await fetchEvents({
          title: `API MOCKADA INICIO: ${info.startStr}`,
          start: info.startStr,
          end: info.startStr,
        });

        await fetchEvents({
          title: `API MOCKADA FIM: ${info.endStr}`,
          start: info.endStr,
          end: info.endStr,
        });
      },
    };

    const clear = () => {
      clearCalendar();
    };

    const deleteEvent = (event) => {
      removeEvent(event);
    };

    const overlayLoadingIndicator = () => {
      const fcViewHarness = document.querySelector('.fc-view-harness');

      if (fcViewHarness) {
        const overlayDiv = document.createElement('div');

        overlayDiv.id = 'overlay-loading-indicator';

        overlayDiv.style.height = `${fcViewHarness.offsetHeight}px`;
        overlayDiv.style.width = `${fcViewHarness.offsetWidth}px`;
        overlayDiv.innerHTML = '<span>Carregando novas datas...</span>';

        fcViewHarness.appendChild(overlayDiv);
      }
    };

    const removeOverlayLoadingIndicator = () => {
      const overlayDiv = document.querySelector(
        'div#overlay-loading-indicator'
      );

      if (overlayDiv) {
        overlayDiv.remove();
      }
    };

    watch(loading, (value) => {
      if (value) {
        overlayLoadingIndicator();
        return;
      }
      removeOverlayLoadingIndicator();
    });

    return { events, calendarOptions, clear, overlayLoadingIndicator };
  },
};
</script>

<style>
button {
  margin: 10px;
  padding: 10px;
  background-color: #c0c0c0;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}

#overlay-loading-indicator {
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

#overlay-loading-indicator::after {
  content: '';
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

#overlay-loading-indicator span {
  color: #fff;
  font-size: 30px;
  margin-right: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
