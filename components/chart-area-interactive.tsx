"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart for invoice analytics"

const chartData = [
  { date: "2024-04-01", processed: 22, pending: 15 },
  { date: "2024-04-02", processed: 9, pending: 18 },
  { date: "2024-04-03", processed: 16, pending: 12 },
  { date: "2024-04-04", processed: 24, pending: 26 },
  { date: "2024-04-05", processed: 37, pending: 29 },
  { date: "2024-04-06", processed: 30, pending: 34 },
  { date: "2024-04-07", processed: 24, pending: 18 },
  { date: "2024-04-08", processed: 40, pending: 32 },
  { date: "2024-04-09", processed: 5, pending: 11 },
  { date: "2024-04-10", processed: 26, pending: 19 },
  { date: "2024-04-11", processed: 32, pending: 35 },
  { date: "2024-04-12", processed: 29, pending: 21 },
  { date: "2024-04-13", processed: 34, pending: 38 },
  { date: "2024-04-14", processed: 13, pending: 22 },
  { date: "2024-04-15", processed: 12, pending: 17 },
  { date: "2024-04-16", processed: 13, pending: 19 },
  { date: "2024-04-17", processed: 44, pending: 36 },
  { date: "2024-04-18", processed: 36, pending: 41 },
  { date: "2024-04-19", processed: 24, pending: 18 },
  { date: "2024-04-20", processed: 8, pending: 15 },
  { date: "2024-04-21", processed: 13, pending: 20 },
  { date: "2024-04-22", processed: 22, pending: 17 },
  { date: "2024-04-23", processed: 13, pending: 23 },
  { date: "2024-04-24", processed: 38, pending: 29 },
  { date: "2024-04-25", processed: 21, pending: 25 },
  { date: "2024-04-26", processed: 7, pending: 13 },
  { date: "2024-04-27", processed: 38, pending: 42 },
  { date: "2024-04-28", processed: 12, pending: 18 },
  { date: "2024-04-29", processed: 31, pending: 24 },
  { date: "2024-04-30", processed: 45, pending: 38 },
]

const chartConfig = {
  invoices: {
    label: "Invoices",
  },
  processed: {
    label: "Processed",
    color: "#3b82f6", // Blue color for processed
  },
  pending: {
    label: "Pending", 
    color: "#f59e0b", // Orange color for pending
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-04-30")
    let daysToSubtract = 30
    if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Invoice Processing Analytics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Invoice processing trends for the last month
          </span>
          <span className="@[540px]/card:hidden">Last month trends</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="bg-black rounded-lg p-4 border border-gray-700">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillProcessed" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#ffffff"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="#ffffff"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#e5e7eb"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#e5e7eb"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#374151" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: '#ffffff', fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    config={chartConfig}
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="pending"
                type="natural"
                fill="url(#fillPending)"
                stroke="#000000"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="processed"
                type="natural"
                fill="url(#fillProcessed)"
                stroke="#000000"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}