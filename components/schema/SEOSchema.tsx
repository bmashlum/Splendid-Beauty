'use client'

import React, { Fragment } from 'react'
import Head from 'next/head'
import LocalBusinessSchema from './LocalBusinessSchema'
import FAQSchema from './FAQSchema'
import WebpageSchema from './WebpageSchema'

export default function SEOSchema() {
  return (
    <Fragment>
      <LocalBusinessSchema />
      <FAQSchema />
      <WebpageSchema />
    </Fragment>
  )
}