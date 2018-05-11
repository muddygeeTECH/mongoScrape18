import DS from 'ember-data';

export default DS.Model.extend({
  _id: DS.attr(),
  title: DS.attr('string'),
  date: DS.attr('string'),
  comment: DS.attr()
});