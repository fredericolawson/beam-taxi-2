'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Calendar10({ date, setDate, label }: { date: Date; setDate: (date: Date) => void; label: string }) {
  const [month, setMonth] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="w-fit">
      <CardContent>
        <Calendar
          required
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0"
        />
      </CardContent>
    </Card>
  );
}
