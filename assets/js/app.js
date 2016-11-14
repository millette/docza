/* global $, MediumEditor */

$(() => {
  $(document).foundation()
  const editor = $('.wysiwyg')[0]
  if (editor) {
    new MediumEditor(editor, { // eslint-disable-line no-new
      placeholder: {
        text: 'Entrez votre texte. Sélectionnez en une partie pour voir le toolbar de styles.'
      }
    })
  }
})
