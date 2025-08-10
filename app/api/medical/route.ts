import { NextRequest, NextResponse } from 'next/server';
import { 
  Appointment, 
  MedicalRecord, 
  Medication, 
  FamilyMember,
  TransportDetails,
  Notification
} from '../../types/medical';
import { User } from '../../types';

// Mock database (in real app, this would be a proper database)
let users: User[] = [
  {
    id: '1',
    username: 'john.doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    gender: 'male',
    age: 74,
    weight: 70,
    height: 170,
    bmi: 24.2,
    recordMenstruation: false,
    medicalConditions: {
      hypertension: false,
      diabetes: false,
      cholesterol: false
    },
    onboardingCompleted: true,
    role: 'patient',
    linkedPatientId: undefined,
    organization: undefined,
    staffId: undefined,
    isElderly: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let appointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    hospitalId: 'h1',
    doctorId: 'd1',
    appointmentDate: new Date('2024-01-15'),
    appointmentTime: '10:00 AM',
    appointmentType: 'checkup',
    status: 'scheduled',
    notes: 'Annual health checkup',
    estimatedDuration: 60,
    requiresTransport: true,
    transportDetails: {
      id: 't1',
      appointmentId: '1',
      pickupAddress: '123 Home Street',
      dropoffAddress: '456 Hospital Avenue',
      pickupTime: new Date('2024-01-15T09:30:00'),
      estimatedReturnTime: new Date('2024-01-15T12:00:00'),
      transportProvider: 'grab',
      transportStatus: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let medications: Medication[] = [
  {
    id: 'm1',
    prescriptionId: 'p1',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosage: '500mg',
    frequency: 'Twice daily',
    instructions: 'Take with meals',
    prescribedBy: 'Dr. Smith',
    prescribedDate: new Date('2024-01-01'),
    startDate: new Date('2024-01-01'),
    isActive: true,
    refillsRemaining: 2,
    totalRefills: 3,
    currentStock: 15,
    refillReminder: true,
    refillThreshold: 5,
    takenToday: false,
    notes: 'Take with meals',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let familyMembers: FamilyMember[] = [
  {
    id: 'f1',
    elderlyId: '1',
    childId: 'c1',
    relationship: 'daughter',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '+1-555-0123',
    isPrimaryContact: true,
    canViewRecords: true,
    canEditRecords: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let notifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'You have a checkup appointment tomorrow at 10:00 AM',
    isRead: false,
    createdAt: new Date()
  }
];

// GET /api/medical - Get dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      } as any); // Changed from ApiResponse to any to avoid import error
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      } as any); // Changed from ApiResponse to any to avoid import error
    }

    switch (type) {
      case 'dashboard':
        const userAppointments = appointments.filter(a => a.patientId === userId);
        const userMedications = medications.filter(m => m.prescriptionId && m.prescriptionId.startsWith('p'));
        const userFamilyMembers = familyMembers.filter(f => f.elderlyId === userId);
        const userNotifications = notifications.filter(n => n.userId === userId);

        return NextResponse.json({
          success: true,
          data: {
            stats: {
              totalAppointments: userAppointments.length,
              upcomingAppointments: userAppointments.filter(a => 
                new Date(a.appointmentDate) > new Date() && a.status === 'scheduled'
              ).length,
              activeMedications: userMedications.filter(m => m.isActive).length,
              recentMedicalRecords: 8, // Mock data
              familyMembers: userFamilyMembers.length,
              notifications: userNotifications.filter(n => !n.isRead).length
            },
            appointments: userAppointments,
            medications: userMedications,
            familyMembers: userFamilyMembers,
            notifications: userNotifications
          }
        } as any); // Changed from ApiResponse to any to avoid import error

      case 'appointments':
        const userAppts = appointments.filter(a => a.patientId === userId);
        return NextResponse.json({
          success: true,
          data: userAppts
        } as any); // Changed from ApiResponse to any to avoid import error

      case 'medications':
        const userMeds = medications.filter(m => m.prescriptionId && m.prescriptionId.startsWith('p'));
        return NextResponse.json({
          success: true,
          data: userMeds
        } as any); // Changed from ApiResponse to any to avoid import error

      case 'family':
        const userFamily = familyMembers.filter(f => f.elderlyId === userId);
        return NextResponse.json({
          success: true,
          data: userFamily
        } as any); // Changed from ApiResponse to any to avoid import error

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        } as any); // Changed from ApiResponse to any to avoid import error
    }
  } catch (error) {
    console.error('Error in GET /api/medical:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as any); // Changed from ApiResponse to any to avoid import error
  }
}

// POST /api/medical - Create new records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'appointment':
        const newAppointment: Appointment = {
          id: `app_${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        appointments.push(newAppointment);

        // Create notification for family members
        const familyMembersForUser = familyMembers.filter(f => f.elderlyId === data.patientId);
        familyMembersForUser.forEach(member => {
          if (member.childId) {
            const notification: Notification = {
              id: `notif_${Date.now()}_${Math.random()}`,
              userId: member.childId,
              type: 'appointment',
              title: 'New Appointment Scheduled',
              message: `A new appointment has been scheduled for ${newAppointment.appointmentDate.toLocaleDateString()}`,
              isRead: false,
              createdAt: new Date()
            };
            notifications.push(notification);
          }
        });

        return NextResponse.json({
          success: true,
          data: newAppointment
        } as any); // Changed from ApiResponse to any to avoid import error

      case 'medication':
        const newMedication: Medication = {
          id: `m${medications.length + 1}`,
          prescriptionId: body.prescriptionId || '',
          name: body.name,
          genericName: body.genericName,
          dosage: body.dosage,
          frequency: body.frequency,
          instructions: body.instructions,
          prescribedBy: body.prescribedBy,
          prescribedDate: new Date(body.prescribedDate),
          startDate: new Date(body.startDate),
          isActive: body.isActive,
          refillsRemaining: body.refillsRemaining,
          totalRefills: body.totalRefills,
          currentStock: body.currentStock,
          refillReminder: body.refillReminder,
          refillThreshold: body.refillThreshold,
          takenToday: body.takenToday,
          notes: body.notes,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        medications.push(newMedication);

        return NextResponse.json({
          success: true,
          data: newMedication
        } as any); // Changed from ApiResponse to any to avoid import error

      case 'family-member':
        const newFamilyMember: FamilyMember = {
          id: `fam_${Date.now()}`,
          ...data,
          createdAt: new Date()
        };
        familyMembers.push(newFamilyMember);

        return NextResponse.json({
          success: true,
          data: newFamilyMember
        } as any); // Changed from ApiResponse to any to avoid import error

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        } as any); // Changed from ApiResponse to any to avoid import error
    }
  } catch (error) {
    console.error('Error in POST /api/medical:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as any); // Changed from ApiResponse to any to avoid import error
  }
}

// PUT /api/medical - Update records
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    switch (type) {
      case 'transport-status':
        const appointment = appointments.find(a => a.id === id);
        if (!appointment || !appointment.transportDetails) {
          return NextResponse.json({
            success: false,
            error: 'Appointment or transport details not found'
          } as any); // Changed from ApiResponse to any to avoid import error
        }

        appointment.transportDetails.transportStatus = data.status;
        appointment.transportDetails.updatedAt = new Date();

        // Send notifications to family members
        const familyMembersForUser = familyMembers.filter(f => f.elderlyId === appointment.patientId);
        familyMembersForUser.forEach(member => {
          if (member.childId) {
            let message = '';
            switch (data.status) {
              case 'en-route':
                message = 'Transport is on the way to pick up the patient';
                break;
              case 'picked-up':
                message = 'Patient has been picked up and is on the way to the hospital';
                break;
              case 'at-hospital':
                message = 'Patient has arrived at the hospital';
                break;
              case 'returning':
                message = 'Patient is on the way back home';
                break;
              case 'completed':
                message = 'Transport has been completed';
                break;
              default:
                message = 'Transport status has been updated';
            }

            const notification: Notification = {
              id: `notif_${Date.now()}_${Math.random()}`,
              userId: member.childId,
              type: 'transport',
              title: 'Transport Update',
              message,
              isRead: false,
              createdAt: new Date()
            };
            notifications.push(notification);
          }
        });

        return NextResponse.json({
          success: true,
          data: appointment
        } as any); // Changed from ApiResponse to any to avoid import error

      case 'medication-taken':
        const medication = medications.find(m => m.id === body.medicationId);
        if (!medication) {
          return NextResponse.json({
            success: false,
            error: 'Medication not found'
          } as any);
        }
        medication.takenToday = true;
        medication.lastTaken = new Date();
        medication.updatedAt = new Date();
        return NextResponse.json({
          success: true,
          data: medication
        } as any);

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        } as any); // Changed from ApiResponse to any to avoid import error
    }
  } catch (error) {
    console.error('Error in PUT /api/medical:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as any); // Changed from ApiResponse to any to avoid import error
  }
}

// DELETE /api/medical - Delete records
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({
        success: false,
        error: 'Type and ID are required'
      } as any); // Changed from ApiResponse to any to avoid import error
    }

    switch (type) {
      case 'appointment':
        const appointmentIndex = appointments.findIndex(a => a.id === id);
        if (appointmentIndex === -1) {
          return NextResponse.json({
            success: false,
            error: 'Appointment not found'
          } as any); // Changed from ApiResponse to any to avoid import error
        }
        appointments.splice(appointmentIndex, 1);
        break;

      case 'medication':
        const medicationIndex = medications.findIndex(m => m.id === id);
        if (medicationIndex === -1) {
          return NextResponse.json({
            success: false,
            error: 'Medication not found'
          } as any); // Changed from ApiResponse to any to avoid import error
        }
        medications.splice(medicationIndex, 1);
        break;

      case 'family-member':
        const familyIndex = familyMembers.findIndex(f => f.id === id);
        if (familyIndex === -1) {
          return NextResponse.json({
            success: false,
            error: 'Family member not found'
          } as any); // Changed from ApiResponse to any to avoid import error
        }
        familyMembers.splice(familyIndex, 1);
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        } as any); // Changed from ApiResponse to any to avoid import error
    }

    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully'
    } as any); // Changed from ApiResponse to any to avoid import error
  } catch (error) {
    console.error('Error in DELETE /api/medical:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as any); // Changed from ApiResponse to any to avoid import error
  }
} 