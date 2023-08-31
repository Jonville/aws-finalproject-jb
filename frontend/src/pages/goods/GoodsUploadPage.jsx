import React from 'react'

import '../../styles/base/sub.css'
import '../../styles/base/goodsStyle.css'

import PageVisual from "../../components/layout/PageVisual"
import GoodsUploadForm from './GoodsUploadForm'

const GoodsUploadPage = () => {

  return (
    <main id="pageContainer" className="goods">
      <PageVisual/>

      <div id="pageContents">
        <GoodsUploadForm/>
      </div>

    </main>
  )
}

export default GoodsUploadPage