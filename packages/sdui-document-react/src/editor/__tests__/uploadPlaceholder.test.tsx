import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { BlockChrome } from '../../block-types/BlockChrome'

describe('upload placeholder rendering', () => {
  describe('ImageBlock', () => {
    test('uploading state renders a status placeholder instead of an img', () => {
      render(
        <BlockChrome
          block={createDocumentBlock({
            id: 'img-1',
            type: 'document.image',
            state: { text: '', upload: 'uploading' },
            attributes: { alt: 'photo.png' },
          })}
        />,
      )
      expect(screen.getByRole('status')).toHaveTextContent(/uploading photo\.png/i)
      expect(document.querySelector('img')).toBeNull()
    })

    test('error state renders an alert', () => {
      render(
        <BlockChrome
          block={createDocumentBlock({
            id: 'img-1',
            type: 'document.image',
            state: { text: '', upload: 'error' },
            attributes: { alt: 'photo.png' },
          })}
        />,
      )
      expect(screen.getByRole('alert')).toHaveTextContent(/upload failed/i)
    })

    test('done state (src set, upload cleared) renders the image', () => {
      render(
        <BlockChrome
          block={createDocumentBlock({
            id: 'img-1',
            type: 'document.image',
            state: { text: '' },
            attributes: { alt: 'photo.png', src: 'https://cdn/x.png' },
          })}
        />,
      )
      expect(document.querySelector('img')?.getAttribute('src')).toBe('https://cdn/x.png')
    })
  })

  describe('FileBlock', () => {
    test('uploading state renders a status placeholder instead of a link', () => {
      render(
        <BlockChrome
          block={createDocumentBlock({
            id: 'file-1',
            type: 'document.file',
            state: { text: '', upload: 'uploading' },
            attributes: { name: 'doc.pdf' },
          })}
        />,
      )
      expect(screen.getByRole('status')).toHaveTextContent(/uploading doc\.pdf/i)
      expect(document.querySelector('a')).toBeNull()
    })

    test('error state renders an alert', () => {
      render(
        <BlockChrome
          block={createDocumentBlock({
            id: 'file-1',
            type: 'document.file',
            state: { text: '', upload: 'error' },
            attributes: { name: 'doc.pdf' },
          })}
        />,
      )
      expect(screen.getByRole('alert')).toHaveTextContent(/upload failed/i)
    })

    test('done state (url set, upload cleared) renders the download link', () => {
      render(
        <BlockChrome
          block={createDocumentBlock({
            id: 'file-1',
            type: 'document.file',
            state: { text: '' },
            attributes: { name: 'doc.pdf', url: 'https://cdn/doc.pdf' },
          })}
        />,
      )
      expect(document.querySelector('a')?.getAttribute('href')).toBe('https://cdn/doc.pdf')
    })
  })
})
