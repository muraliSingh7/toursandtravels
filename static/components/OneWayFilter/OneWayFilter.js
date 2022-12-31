let oneWayFilterTemplate = document.createElement('template');
oneWayFilterTemplate.innerHTML =
   `<link rel="stylesheet" href="static/components/OneWayFilter/OneWayFilter.css">
   <div class='container' name='stoppage'>
      <p class='title' name='stopFromSource'></p>
   </div>
   <div class='container' name='departure'>
      <p class='title' name='departureFromSource'></p>
      <div>
         <div class='timeIntervalButton' departure-time="0AM-6AM">
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_active.png?v=1"></img>
            <p class="timeTitle">Before 6AM</p>
            <p class="buttonPrice"></p>
         </div>
         <div class='timeIntervalButton' departure-time="6AM-12PM">
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png?v=1"></img>
            <p class="timeTitle">6AM-12PM</p>
            <p class="buttonPrice"></p>
         </div>
         <div class='timeIntervalButton' departure-time="12PM-6PM">
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png?v=1"></img>
            <p class="timeTitle">12PM-6PM</p>
            <p class="buttonPrice"></p>
         </div>
         <div class='timeIntervalButton' departure-time="6PM-12AM">
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png?v=1"></img>
            <p class="timeTitle">After 6PM</p>
            <p class="buttonPrice"></p>
         </div>
      </div>
   </div>
   <div class='container' name='arrival'>
      <p class='title' name='arrivalToDestination'></p>
      <div>
         <div class='timeIntervalButton' arrival-time="0AM-6AM">
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/morning_active.png?v=1"></img>
            <p class="timeTitle">Before 6AM</p>
            <p class="buttonPrice"></p>
         </div>
         <div class='timeIntervalButton' arrival-time="6AM-12PM">
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/noon_inactive.png?v=1"></img>
            <p class="timeTitle">6AM-12PM</p>
            <p class="buttonPrice"></p>
         </div>
         <div class='timeIntervalButton' arrival-time="12PM-6PM" >
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/evening_inactive.png?v=1"></img>
            <p class="timeTitle">12PM-6PM</p>
            <p class="buttonPrice"></p>
         </div>
         <div class='timeIntervalButton' arrival-time="6PM-12AM">
            <img src="https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/night_inactive.png?v=1"></img>
            <p class="timeTitle">After 6PM</p>
            <p class="buttonPrice"></p>
         </div>
      </div>
   </div>
   <div class='container' name='airlines'>
      <p class='title'>Airlines</p>
   </div>`;


class OneWayFilter extends HTMLElement {
   constructor(source, destination, numberOfStopsFromSource,DepartureFromSourceAsPerTime, ArrivalAtDestinationAsPerTime, Airline) {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(oneWayFilterTemplate.content.cloneNode(true));
      this.creatingFilterColumn(source, destination);
      this.creatingButtonsAsPerTimeRange(this.shadowRoot.querySelector('[name=departure]'),DepartureFromSourceAsPerTime,'departure');
      this.creatingButtonsAsPerTimeRange(this.shadowRoot.querySelector('[name=arrival]'),ArrivalAtDestinationAsPerTime,'arrival');
   }

   connectedCallBack() {

   };


   creatingFilterColumn(source, destination) {
      this.shadowRoot.querySelector('[name=stopFromSource]').textContent = `Stops From ${source}`;
      this.shadowRoot.querySelector('[name=departureFromSource]').textContent = `Departure From ${source}`;
      this.shadowRoot.querySelector('[name=arrivalToDestination]').textContent = `Arrival To ${destination}`;
   }

   
}






window.customElements.define("one-way-filter", OneWayFilter);