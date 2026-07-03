import { groupRecordsByMonthYear } from '../utils/recordUtils';
import type { HealthRecord } from '../types';

describe('groupRecordsByMonthYear', () => {
  it('groups records by month and year', () => {
    const records: HealthRecord[] = [
      {
        id: '1', type: 'consultation', title: 'A', date: '2024-03-15T00:00:00.000Z',
        doctorName: 'Dr. X', facility: 'Clinic', tags: [], notes: '',
      },
      {
        id: '2', type: 'lab_report', title: 'B', date: '2024-03-20T00:00:00.000Z',
        doctorName: 'Dr. Y', facility: 'Lab', tags: [], notes: '',
      },
      {
        id: '3', type: 'prescription', title: 'C', date: '2024-01-10T00:00:00.000Z',
        doctorName: 'Dr. Z', facility: 'Clinic', tags: [], notes: '',
      },
    ];

    const sections = groupRecordsByMonthYear(records);
    expect(sections.length).toBe(2);
    expect(sections[0].data.length).toBeGreaterThan(0);
  });
});
