// src/views/components/dashboard/date-range-picker.tsx
import { useEffect, useRef, useState } from 'react'

interface DateRangePickerProps {
  dateFrom: string
  dateTo: string
  onChange: (field: 'dateFrom' | 'dateTo', value: string) => void
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

function parseDate(str: string): Date | null {
  if (!str) return null
  const d = new Date(str + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

function CalendarMonth({
  year,
  month,
  selectedFrom,
  selectedTo,
  hoverDate,
  onDayClick,
  onDayHover,
}: {
  year: number
  month: number
  selectedFrom: Date | null
  selectedTo: Date | null
  hoverDate: Date | null
  onDayClick: (d: Date) => void
  onDayHover: (d: Date | null) => void
}) {
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const rangeEnd = selectedTo ?? hoverDate

  const cells: (Date | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{
        textAlign: 'center',
        fontWeight: 600,
        fontSize: 13,
        color: '#1e293b',
        marginBottom: 10,
        marginTop: 0,
      }}>
        {MONTHS_PT[month]} {year}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAYS_PT.map((d) => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 500,
            color: '#94a3b8',
            paddingBottom: 6,
          }}>
            {d}
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} style={{ height: 32 }} />

          const isStart = !!(selectedFrom && isSameDay(date, selectedFrom))
          const isEnd = !!(selectedTo && isSameDay(date, selectedTo))
          const isHoverEnd = !!(selectedTo === null && hoverDate && isSameDay(date, hoverDate))
          const isSelected = isStart || isEnd || isHoverEnd

          const inRange = !!(
            selectedFrom &&
            rangeEnd &&
            date > selectedFrom &&
            date < rangeEnd
          )

          return (
            <div
              key={date.toISOString()}
              onClick={() => onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              style={{
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: inRange ? '#f1f5f9' : 'transparent',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: isSelected ? 600 : 400,
                backgroundColor: isSelected ? '#1e293b' : 'transparent',
                color: isSelected ? '#ffffff' : '#334155',
                transition: 'background-color 0.1s',
                userSelect: 'none',
              }}>
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DateRangePicker({ dateFrom, dateTo, onChange }: DateRangePickerProps) {
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [pendingFrom, setPendingFrom] = useState<Date | null>(parseDate(dateFrom))
  const [pendingTo, setPendingTo] = useState<Date | null>(parseDate(dateTo))
  const [selecting, setSelecting] = useState<'from' | 'to'>('from')

  const initLeft = parseDate(dateFrom)
    ? addMonths(parseDate(dateFrom)!.getFullYear(), parseDate(dateFrom)!.getMonth(), -1)
    : addMonths(today.getFullYear(), today.getMonth(), -1)

  const [leftYear, setLeftYear] = useState(initLeft.year)
  const [leftMonth, setLeftMonth] = useState(initLeft.month)

  const right = addMonths(leftYear, leftMonth, 1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => { setPendingFrom(parseDate(dateFrom)) }, [dateFrom])
  useEffect(() => { setPendingTo(parseDate(dateTo)) }, [dateTo])

  function handleDayClick(date: Date) {
    if (selecting === 'from') {
      setPendingFrom(date)
      setPendingTo(null)
      setSelecting('to')
    } else {
      if (pendingFrom && date < pendingFrom) {
        setPendingTo(pendingFrom)
        setPendingFrom(date)
      } else {
        setPendingTo(date)
      }
      setSelecting('from')
    }
  }

  function handleApply() {
    if (pendingFrom) onChange('dateFrom', toISODate(pendingFrom))
    if (pendingTo) onChange('dateTo', toISODate(pendingTo))
    else if (pendingFrom) onChange('dateTo', toISODate(pendingFrom))
    setOpen(false)
  }

  function handleClear() {
    setPendingFrom(null)
    setPendingTo(null)
    setSelecting('from')
    onChange('dateFrom', '')
    onChange('dateTo', '')
  }

  function formatRange() {
    const from = parseDate(dateFrom)
    const to = parseDate(dateTo)
    const fmt = (d: Date) =>
      d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    if (from && to) return `${fmt(from)} – ${fmt(to)}`
    if (from) return `${fmt(from)} – ...`
    return 'Selecione o período'
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          height: 36,
          minWidth: 248,
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '0 10px',
          fontSize: 12,
          color: dateFrom || dateTo ? '#334155' : '#94a3b8',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          outline: 'none',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span style={{ flex: 1 }}>{formatRange()}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          zIndex: 50,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          padding: '16px 20px 0 20px',
          width: 560,
        }}>
          {/* Nav arrows */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}>
            <button
              type="button"
              onClick={() => { const p = addMonths(leftYear, leftMonth, -1); setLeftYear(p.year); setLeftMonth(p.month) }}
              style={{
                background: 'none', border: '1px solid #e2e8f0', cursor: 'pointer',
                borderRadius: 6, width: 28, height: 28, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 16,
              }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => { const n = addMonths(leftYear, leftMonth, 1); setLeftYear(n.year); setLeftMonth(n.month) }}
              style={{
                background: 'none', border: '1px solid #e2e8f0', cursor: 'pointer',
                borderRadius: 6, width: 28, height: 28, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 16,
              }}
            >
              ›
            </button>
          </div>

          {/* Two months */}
          <div style={{ display: 'flex', gap: 20 }}>
            <CalendarMonth
              year={leftYear} month={leftMonth}
              selectedFrom={pendingFrom} selectedTo={pendingTo}
              hoverDate={hoverDate}
              onDayClick={handleDayClick} onDayHover={setHoverDate}
            />
            <div style={{ width: 1, backgroundColor: '#e2e8f0', flexShrink: 0 }} />
            <CalendarMonth
              year={right.year} month={right.month}
              selectedFrom={pendingFrom} selectedTo={pendingTo}
              hoverDate={hoverDate}
              onDayClick={handleDayClick} onDayHover={setHoverDate}
            />
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #f1f5f9',
            marginTop: 12,
            padding: '10px 0 12px',
          }}>
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: '#64748b', padding: '6px 4px', borderRadius: 6,
              }}
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={handleApply}
              style={{
                backgroundColor: '#1e293b', color: '#ffffff', border: 'none',
                borderRadius: 8, padding: '8px 22px', fontSize: 13,
                fontWeight: 500, cursor: 'pointer',
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
