<template>
  <div class="card-header">
    <template v-if="config.alternative">
      <div class="alt-header-container">
        <div class="alt-header">
          <div v-if="config.circleText" class="media-object img-circle session-logo" :class="config.circleClass">
            <b>{{ config.circleText }}</b>
          </div>
          <img v-else-if="config.circleImage" :src="`https://cdn.parlameter.si/v1/parlassets/img/people/square/${config.circleImage}.png`" class="portrait column" />
          <div class="header-info-container">
            <h1>{{ config.heading }}</h1>
            <h2 class="partyinfo">{{ config.subheading }}</h2>
            <h2 class="cardname">{{ config.title }}</h2>
        </div>
        </div>
        <div class="alt-header-border"></div>
      </div>
    </template>
    <template v-else>
      <div class="card-header-border"></div>
      <h1>{{ config.title }}</h1>
    </template>
  </div>

</template>

<script>
import { escape } from 'lodash'

export default {
  name: 'CardHeader',
  props: {
    config: Object
  }
}
</script>

