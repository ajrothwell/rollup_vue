<template>
  <div class="external-link">
    <a target="_blank"
       :href="externalLinkHref"
    >
      {{ externalLinkText }}
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      'slots': {
        type: Object,
        default: function() { return {} }
      },
      'options': {
        type: Object,
        default: function() { return {} }
      },
      'item': {
        type: Object,
        default: function() { return {} }
      },
      'count': {
        type: Number,
        default: function() { return }
      },
      'limit': {
        type: Number,
        default: function() { return }
      },
      'type': {
        type: String,
        default: function() { return }
      }
    },
    computed: {
      nullValue() {
        const options = this.options || {};
        return options.nullValue;
      },
      // for horizontal tables only
      externalLinkCount() {
        return this.count - this.limit;
      },
      // for horizontal or vertical tables
      externalLinkAction() {
        const actionFn = this.options.action;
        if (actionFn) {
          return actionFn(this.externalLinkCount) || 'See more at ';
        }
      },
      // for anything else, for getting data from the state
      externalLinkDataFromState() {
        // return this.options.externalLink.action || 'See more at ';
        const stateData = this.options.data;
        return this.evaluateSlot(stateData);
      },
      externalLinkText() {
        if (this.options) {
          const name = this.options.name  || '';
          // const preText = this.options.preText;
          // const postText = this.options.postText;

          if (this.type === 'vertical-table') {
          // if (this.externalLinkAction) {
            if (name) {
              return `${this.externalLinkAction} at ${name}`;
            } else {
              return `${this.externalLinkAction}`;
            }
          } else if (this.type === 'horizontal-table') {
            // if (name) {
            //   return `${this.externalLinkAction} at ${name}`;
            // } else {
              return `${this.externalLinkAction}`;
            // }
          } else {
            return `${this.externalLinkDataFromState}`
          }
        } else {
          return null;
        }
      },
      externalLinkHref() {
        if (this.options) {
          return this.evaluateSlot(this.options.href);
        } else {
          return null;
        }
      },
      // the number of items that aren't being shown (e.g. See 54 more...)
    },
    methods: {
      evaluateSlot(valOrGetter, transforms = [], nullValue = '') {
        // console.log('evaluateSlot is running, valOrGetter:', valOrGetter);
        // check for null val/getter
        if (!valOrGetter) {
          return valOrGetter;
        }

        const valOrGetterType = typeof valOrGetter;
        let val;

        // fn
        if (valOrGetterType === 'function') {
          const state = this.$store.state;
          const controller = this.$controller;
          const getter = valOrGetter;
          const item = this.item;

          if (item) {
            val = getter(state, item, controller);
          } else {
            // console.log('evaluateSlot, about to get value');
            val = getter(state);
            // console.log('state:', state, 'val:', val);
          }
        } else {
          val = valOrGetter;
        }

        // format nulls but not falses
        if (val === false) {

        } else if (!val) {
          return nullValue;
        }

        // apply transforms
        for (let transformKey of transforms) {
          // get transform definition from config by name
          const transform = this.$config.transforms[transformKey];
          // make object of (relevant) globals by filtering window object
          let globals;
          const globalKeys = transform.globals;
          if (globalKeys) {
            globals = Object.keys(window)
                          .filter(key => globalKeys.includes(key))
                          .reduce((obj, key) => {
                              obj[key] = window[key];
                              return obj;
                          }, {});
          }
          // run transform
          const fn = transform.transform;
          val = fn(val, globals);
        }

        return val;
      }
    }
  };

</script>

<style scoped>

.external-link {
  padding-top: 5px;
}

</style>
