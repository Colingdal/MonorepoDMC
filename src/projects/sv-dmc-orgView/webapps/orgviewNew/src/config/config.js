/* eslint-disable no-undef */
$(function () {
  $('#responsible-section').hide();
  $('#metadata-section').hide();
  $('#button-section').hide();
  $('#cardAttribute-section').hide();

  function updateSections() {
    const selectedValue = $('#view').val();
    const isCurrentUserChecked = $('input[name="checkboxBooleanCurrentUser"]').is(':checked');

    $('#responsible-section').toggle(selectedValue === 'mycollegues');
    $('#metadata-section').toggle(selectedValue === 'mycollegues' && !isCurrentUserChecked);
    $('#button-section').toggle(selectedValue === 'orgchart');
  }

  $('input[name="checkboxBooleanSocialCollaboration"]').on('change', function () {
    $('#cardAttribute-section').toggle($(this).is(':checked'));
  });

  $('#view').on('change', updateSections);
  $('input[name="checkboxBooleanCurrentUser"]').on('change', updateSections);

  updateSections();
});
