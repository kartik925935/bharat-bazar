'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Paperclip, Clock, ShieldAlert, CheckCircle2, User, Building2, Tag, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SATicket } from '@/types/super-admin.types'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saTicketReplySchema, type SATicketReplyInput } from '@/lib/validators/sa-operations.validators'
import Link from 'next/link'
import { z } from 'zod'

interface TicketDetailDrawerProps {
  ticketId: string | null
  onClose: () => void
}

export function TicketDetailDrawer({ ticketId, onClose }: TicketDetailDrawerProps) {
  const { tickets, replyToTicket, addTicketInternalNote, updateTicket, closeTicket } = useSuperAdminStore()
  const ticket = tickets.find(t => t.id === ticketId)
  
  const [activeTab, setActiveTab] = useState<'conversation' | 'details' | 'internal_notes'>('conversation')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, reset, watch } = useForm<SATicketReplyInput>({
    resolver: zodResolver(saTicketReplySchema) as any,
    defaultValues: { isInternal: false, message: '' }
  })
  const isInternal = watch('isInternal')

  useEffect(() => {
    if (activeTab === 'conversation' || activeTab === 'internal_notes') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [ticket?.messages, activeTab])

  if (!ticket) return null

  const onSendReply = async (data: SATicketReplyInput) => {
    await replyToTicket(ticket.id, data)
    reset()
  }

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'open': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'waiting_for_user': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const visibleMessages = ticket.messages.filter(m => activeTab === 'internal_notes' ? m.isInternal : !m.isInternal)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] xl:w-[700px] bg-[#0B0B12] border-l border-[#1E1E2E] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-[#1E1E2E] bg-[#111118]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border", getStatusColor(ticket.status))}>
                  {ticket.status.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-mono text-[#8B8B9E]">{ticket.ticketNumber}</span>
                {ticket.slaBreached && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> SLA Breach
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">{ticket.subject}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-[#1A1A26] transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-4 border-b border-[#1E1E2E]">
            {[
              { id: 'conversation', label: 'Conversation' },
              { id: 'internal_notes', label: 'Internal Notes' },
              { id: 'details', label: 'Ticket Details' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  "pb-3 text-sm font-bold capitalize transition-colors relative",
                  activeTab === t.id ? "text-[#FF7A00]" : "text-[#8B8B9E] hover:text-white"
                )}
              >
                {t.label}
                {activeTab === t.id && (
                  <motion.div layoutId="ticket-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A00]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto bg-[#0B0B12]">
          
          {(activeTab === 'conversation' || activeTab === 'internal_notes') && (
            <div className="p-6 flex flex-col gap-6">
              {visibleMessages.length === 0 ? (
                <div className="text-center py-10 text-[#6B6B80] text-sm">No messages found in this tab.</div>
              ) : (
                visibleMessages.map((msg) => {
                  const isSystemOrAdmin = msg.senderRole === 'admin' || msg.senderRole === 'super_admin'
                  return (
                    <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isSystemOrAdmin ? "self-end items-end" : "self-start items-start")}>
                      <div className="flex items-baseline gap-2 mb-1 px-1">
                        <span className="text-xs font-bold text-white">{msg.senderName}</span>
                        <span className="text-[10px] text-[#6B6B80] uppercase tracking-wider">{msg.senderRole.replace('_', ' ')}</span>
                        <span className="text-[10px] text-[#6B6B80]">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        isSystemOrAdmin ? (
                          msg.isInternal ? "bg-purple-500/10 border border-purple-500/20 text-purple-100 rounded-tr-sm" 
                                         : "bg-[#FF7A00] text-white rounded-tr-sm"
                        ) : "bg-[#1A1A26] border border-[#2A2A3E] text-[#D0D0E0] rounded-tl-sm"
                      )}>
                        {msg.message}
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 flex gap-2 flex-wrap">
                            {msg.attachments.map((att, i) => (
                              <a key={i} href={att} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-lg overflow-hidden border border-white/10 relative group">
                                <img src={att} alt="Attachment" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Paperclip className="w-4 h-4 text-white" />
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {activeTab === 'details' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl">
                  <span className="text-xs text-[#8B8B9E] font-medium block mb-1">Submitter</span>
                  <div className="flex items-center gap-2 text-sm text-white font-bold">
                    {ticket.submitterRole === 'customer' ? <User className="w-4 h-4 text-blue-400" /> : <Building2 className="w-4 h-4 text-orange-400" />}
                    {ticket.submitterName}
                  </div>
                  <div className="text-xs text-[#6B6B80] mt-1">{ticket.submitterEmail}</div>
                </div>
                
                <div className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl">
                  <span className="text-xs text-[#8B8B9E] font-medium block mb-1">Assigned Admin</span>
                  <div className="flex items-center gap-2 text-sm text-white font-bold">
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    {ticket.assignedAdminName || 'Unassigned'}
                  </div>
                </div>

                <div className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl">
                  <span className="text-xs text-[#8B8B9E] font-medium block mb-1">Category</span>
                  <div className="text-sm text-white capitalize">{ticket.category.replace(/_/g, ' ')}</div>
                </div>

                <div className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl">
                  <span className="text-xs text-[#8B8B9E] font-medium block mb-1">Priority</span>
                  <div className="text-sm text-white capitalize">{ticket.priority}</div>
                </div>
              </div>

              {/* Related Entities */}
              {(ticket.relatedOrderId || ticket.relatedProductId) && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">Related Entities</h3>
                  <div className="flex gap-2">
                    {ticket.relatedOrderId && (
                      <Link href={`/orders/${ticket.relatedOrderId}`} className="px-3 py-1.5 bg-[#1A1A26] border border-[#2A2A3E] hover:border-[#FF7A00]/50 rounded-lg text-sm text-[#FF7A00] transition-colors">
                        Order #{ticket.relatedOrderId}
                      </Link>
                    )}
                    {ticket.relatedProductId && (
                      <Link href={`/products/${ticket.relatedProductId}`} className="px-3 py-1.5 bg-[#1A1A26] border border-[#2A2A3E] hover:border-[#FF7A00]/50 rounded-lg text-sm text-[#FF7A00] transition-colors">
                        Product #{ticket.relatedProductId}
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {ticket.tags && ticket.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#1A1A26] border border-[#2A2A3E] rounded-md text-xs text-[#A0A0B8] flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ticket.satisfactionRating && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-green-400">Resolution Rated: {ticket.satisfactionRating}/5</h4>
                    <p className="text-xs text-green-500/70">Customer submitted feedback after ticket closure.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        {activeTab !== 'details' && (ticket.status !== 'closed' && ticket.status !== 'resolved') && (
          <div className="shrink-0 p-4 border-t border-[#1E1E2E] bg-[#111118]">
            <form onSubmit={handleSubmit(onSendReply)} className="space-y-3">
              {activeTab === 'conversation' && (
                <label className="flex items-center gap-2 px-1 cursor-pointer w-fit">
                  <input type="checkbox" {...register('isInternal')} className="accent-purple-500" />
                  <span className="text-xs font-bold text-purple-400">Send as Internal Note (Hidden from submitter)</span>
                </label>
              )}
              {activeTab === 'internal_notes' && (
                <div className="text-xs font-bold text-purple-400 px-1">
                  You are posting an internal note. It will not be visible to the submitter.
                </div>
              )}
              
              <div className={cn(
                "flex items-end gap-2 bg-[#1A1A26] border rounded-xl p-2 transition-colors",
                isInternal || activeTab === 'internal_notes' ? "border-purple-500/30 focus-within:border-purple-500" : "border-[#2A2A3E] focus-within:border-[#FF7A00]"
              )}>
                <button type="button" className="p-2 text-[#6B6B80] hover:text-white transition-colors shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  {...register('message')}
                  placeholder={isInternal || activeTab === 'internal_notes' ? "Type an internal note..." : "Type your reply..."}
                  className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-[#6B6B80] resize-none focus:ring-0 min-h-[40px] max-h-[120px] py-2"
                  rows={2}
                />
                <button 
                  type="submit" 
                  className={cn(
                    "p-2 rounded-lg text-white transition-colors shrink-0 mb-0.5",
                    isInternal || activeTab === 'internal_notes' ? "bg-purple-600 hover:bg-purple-500" : "bg-[#FF7A00] hover:bg-[#FF4500]"
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
        {(ticket.status === 'closed' || ticket.status === 'resolved') && (
          <div className="shrink-0 p-4 border-t border-[#1E1E2E] bg-[#111118] text-center">
            <p className="text-sm text-[#8B8B9E]">This ticket is closed. Reopen to send a message.</p>
            <button onClick={() => updateTicket(ticket.id, { status: 'open' })} className="mt-2 text-xs text-[#FF7A00] hover:underline font-bold">
              Reopen Ticket
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
