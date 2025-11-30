'use client';

import { useState } from 'react';
import { addMetric } from '../actions/auth';
import { MetricType } from '@/generated/prisma';
import { useUser } from '@/app/contexts/UserContext'

type ButtonProps = {
  metricType: MetricType;
};




