import React from 'react'

export const HtmlIntoJsx = ({html}) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: html }} />
    )
}
