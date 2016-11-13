/* global $, MediumEditor */

$(() => {
  const editor = $('.wysiwyg')[0]
  $(document).foundation()
  if (editor) {
    new MediumEditor(editor, { // eslint-disable-line no-new
      placeholder: {
        text: 'Entrez votre texte. Sélectionnez en une partie pour voir le toolbar de styles.'
      }
    })
  }
})
