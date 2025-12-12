"use client"

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerTitle } from "@/components/ui/drawer" // Shadcn Drawer
import { Mic, Image as ImageIcon, MapPin, Hash, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickEntryDrawerProps {
  isOpen: boolean
  onClose: () => void
  defaultTitle?: string
}

export function QuickEntryDrawer({ isOpen, onClose, defaultTitle }: QuickEntryDrawerProps) {
  const [text, setText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  
  // 模拟自动获取的元数据
  const currentTime = new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
  const currentLocation = "杭州市·西湖区"

  // 模拟语音输入效果
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      // 模拟语音转文字结果
      setText(prev => prev + " 刚才和王总聊得很愉快，他对二期项目有兴趣，但他痛风犯了不能喝酒。")
    } else {
      setIsRecording(true)
    }
  }

  const handleSubmit = () => {
      // TODO: 提交逻辑
      console.log("提交记录:", text)
      setText("")
      onClose()
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 限制最大宽度，适配 PC/Pad */}
      <DrawerContent className="bg-white dark:bg-slate-900 rounded-t-[32px] max-w-md mx-auto">
        {/* 隐藏标题用于无障碍 */}
        <DrawerTitle className="sr-only">快速记录</DrawerTitle>
        
        <div className="w-full p-0">
           {/* 顶部把手 */}
           <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-6" />

           <div className="px-6 pb-8">
               <div className="flex items-center justify-between mb-6">
                   <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-white">
                       {defaultTitle ? `记录：${defaultTitle}` : "此刻记录"}
                   </h3>
                   <div className="flex items-center gap-3 text-xs text-slate-400">
                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {currentLocation}</span>
                       <span>{currentTime}</span>
                   </div>
               </div>

               {/* 输入区域 */}
               <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 min-h-[120px] mb-6 relative border border-slate-100 dark:border-slate-700/50">
                   <textarea 
                       className="w-full h-24 bg-transparent border-none resize-none outline-none text-slate-700 dark:text-slate-200 text-sm placeholder:text-slate-400"
                       placeholder="刚才聊了什么？按住麦克风快速记录..."
                       value={text}
                       onChange={(e) => setText(e.target.value)}
                   />
                   
                   {/* 模拟的录音波纹动画 */}
                   {isRecording && (
                       <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 flex items-center justify-center rounded-2xl z-10 backdrop-blur-sm">
                           <div className="flex gap-1 items-center">
                               <span className="w-1 h-4 bg-primary animate-pulse" />
                               <span className="w-1 h-8 bg-primary animate-pulse delay-75" />
                               <span className="w-1 h-6 bg-primary animate-pulse delay-150" />
                               <span className="w-1 h-3 bg-primary animate-pulse delay-100" />
                               <span className="text-primary font-bold ml-2">正在聆听...</span>
                           </div>
                       </div>
                   )}
               </div>

               {/* 操作工具栏 */}
               <div className="flex items-center justify-between">
                   <div className="flex gap-4">
                       <button 
                           onClick={toggleRecording}
                           className={cn(
                               "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg",
                               isRecording 
                                   ? "bg-red-500 text-white scale-110 shadow-red-500/30" 
                                   : "bg-primary text-white shadow-primary/30 hover:bg-primary/90"
                           )}
                       >
                           <Mic className="w-5 h-5" />
                       </button>
                       <button className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                           <ImageIcon className="w-5 h-5" />
                       </button>
                       <button className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                           <Hash className="w-5 h-5" />
                       </button>
                   </div>

                   <button 
                       onClick={handleSubmit}
                       disabled={!text}
                       className={cn(
                           "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                           text 
                               ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
                               : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                       )}
                   >
                       完成
                       <Send className="w-4 h-4" />
                   </button>
               </div>
           </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
