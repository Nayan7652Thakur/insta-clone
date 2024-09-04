import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'

const CommentDialog = ({open, setOpen}) => {
  return (
    <Dialog open={open}>
        <DialogContent>
            <img src="https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg" alt="" />
        </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
