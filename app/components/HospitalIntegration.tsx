'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Pill, FileText, RefreshCw, CheckCircle, AlertCircle, Plus, Settings } from 'lucide-react';
import { Hospital as HospitalType, Pharmacy as PharmacyType, MedicalRecord, SyncLog } from '../types/medical';

interface HospitalIntegrationProps {
  userId: string;
}

export default function HospitalIntegration({ userId }: HospitalIntegrationProps) {
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [pharmacies, setPharmacies] = useState<PharmacyType[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hospitals' | 'pharmacies' | 'records' | 'sync'>('hospitals');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockHospitals: HospitalType[] = [
        {
          id: 'h1',
          name: 'City General Hospital',
          address: '123 Medical Center Dr, City, State 12345',
          phone: '+1-555-0100',
          email: 'info@citygeneral.com',
          website: 'https://www.citygeneral.com',
          isConnected: true,
          isIntegrated: true,
          apiEndpoint: 'https://api.citygeneral.com/v1',
          apiKey: '***',
          specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'General Medicine'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'h2',
          name: 'Community Medical Center',
          address: '456 Health Ave, City, State 12345',
          phone: '+1-555-0200',
          email: 'contact@communitymed.com',
          website: 'https://www.communitymed.com',
          isConnected: false,
          isIntegrated: false,
          apiEndpoint: '',
          apiKey: '',
          specialties: ['Family Medicine', 'Pediatrics', 'Emergency Medicine'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockPharmacies: PharmacyType[] = [
        {
          id: 'p1',
          name: 'City Pharmacy',
          address: '789 Drug Store Ln, City, State 12345',
          phone: '+1-555-0300',
          email: 'info@citypharmacy.com',
          website: 'https://www.citypharmacy.com',
          isConnected: true,
          apiEndpoint: 'https://api.citypharmacy.com/v1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'p2',
          name: 'Neighborhood Pharmacy',
          address: '321 Local St, City, State 12345',
          phone: '+1-555-0400',
          email: 'contact@neighborhoodpharm.com',
          website: 'https://www.neighborhoodpharm.com',
          isConnected: false,
          apiEndpoint: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockMedicalRecords: MedicalRecord[] = [
        {
          id: 'mr1',
          patientId: userId,
          hospitalId: 'h1',
          doctorId: 'd1',
          visitDate: new Date('2024-01-10'),
          visitType: 'checkup',
          diagnosis: 'Type 2 Diabetes - Well controlled',
          symptoms: ['None reported'],
          treatment: 'Continue current medication regimen',
          prescriptions: [],
          labResults: [],
          notes: 'Patient is doing well. Blood sugar levels are stable.',
          nextAppointment: new Date('2024-04-10'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockSyncLogs: SyncLog[] = [
        {
          id: 'sl1',
          entityType: 'hospital',
          entityId: 'h1',
          syncType: 'sync',
          status: 'success',
          message: 'Successfully synced medical records',
          createdAt: new Date()
        }
      ];

      setHospitals(mockHospitals);
      setPharmacies(mockPharmacies);
      setMedicalRecords(mockMedicalRecords);
      setSyncLogs(mockSyncLogs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectHospital = async (hospitalId: string) => {
    setLoading(true);
    try {
      // Simulate API call to connect hospital
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHospitals(prev => prev.map(h => 
        h.id === hospitalId 
          ? { ...h, isIntegrated: true, apiEndpoint: 'https://api.example.com/v1', apiKey: '***' }
          : h
      ));

      // Create sync log
      const newSyncLog: SyncLog = {
        id: `sync_${Date.now()}`,
        entityType: 'hospital',
        entityId: hospitalId,
        syncType: 'sync',
        status: 'success',
        message: 'Hospital connected successfully',
        createdAt: new Date()
      };
      setSyncLogs(prev => [newSyncLog, ...prev]);

    } catch (error) {
      console.error('Error connecting hospital:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectPharmacy = async (pharmacyId: string) => {
    setLoading(true);
    try {
      // Simulate API call to connect pharmacy
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPharmacies(prev => prev.map(p => 
        p.id === pharmacyId 
          ? { ...p, isConnected: true, canAccessRecords: true, apiEndpoint: 'https://api.example.com/v1', apiKey: '***' }
          : p
      ));

      // Create sync log
      const newSyncLog: SyncLog = {
        id: `sync_${Date.now()}`,
        entityType: 'pharmacy',
        entityId: pharmacyId,
        syncType: 'connect',
        status: 'success',
        message: 'Pharmacy connected successfully',
        createdAt: new Date()
      };
      setSyncLogs(prev => [newSyncLog, ...prev]);

    } catch (error) {
      console.error('Error connecting pharmacy:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncMedicalRecords = async (hospitalId: string) => {
    setLoading(true);
    try {
      // Simulate API call to sync medical records
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add new medical record
      const newRecord: MedicalRecord = {
        id: `mr_${Date.now()}`,
        patientId: userId,
        hospitalId,
        doctorId: 'd1',
        visitDate: new Date(),
        visitType: 'consultation',
        diagnosis: 'Routine checkup - No issues found',
        symptoms: ['None'],
        treatment: 'Continue healthy lifestyle',
        prescriptions: [],
        labResults: [],
        notes: 'Patient is in good health. No medication changes needed.',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setMedicalRecords(prev => [newRecord, ...prev]);

      // Create sync log
      const newSyncLog: SyncLog = {
        id: `sync_${Date.now()}`,
        entityType: 'hospital',
        entityId: hospitalId,
        syncType: 'sync',
        status: 'success',
        message: 'Medical records synced successfully',
        createdAt: new Date()
      };
      setSyncLogs(prev => [newSyncLog, ...prev]);

    } catch (error) {
      console.error('Error syncing medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Hospital & Pharmacy Integration</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 inline mr-2" />
          Add New Connection
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md border">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'hospitals', label: 'Hospitals', icon: Building2 },
            { id: 'pharmacies', label: 'Pharmacies', icon: Pill },
            { id: 'records', label: 'Medical Records', icon: FileText },
            { id: 'sync', label: 'Sync Logs', icon: RefreshCw }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md border p-6">
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Connected Hospitals</h3>
            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{hospital.name}</h4>
                      <p className="text-gray-600">{hospital.address}</p>
                      <p className="text-gray-600">{hospital.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hospital.isIntegrated ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-600">
                          <AlertCircle className="h-5 w-5 mr-1" />
                          Not Connected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Specialties</h5>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        <Settings className="h-4 w-4 inline mr-1" />
                        Settings
                      </button>
                      {hospital.isIntegrated && (
                        <button 
                          onClick={() => syncMedicalRecords(hospital.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          <RefreshCw className="h-4 w-4 inline mr-1" />
                          Sync Records
                        </button>
                      )}
                    </div>
                    {!hospital.isIntegrated && (
                      <button 
                        onClick={() => connectHospital(hospital.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Connect Hospital
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pharmacies' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Connected Pharmacies</h3>
            <div className="space-y-4">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{pharmacy.name}</h4>
                      <p className="text-gray-600">{pharmacy.address}</p>
                      <p className="text-gray-600">{pharmacy.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {pharmacy.isConnected ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Connected
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          Not Connected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        pharmacy.isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pharmacy.isConnected ? 'Can Access Records' : 'No Record Access'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        <Settings className="h-4 w-4 inline mr-1" />
                        Settings
                      </button>
                      {pharmacy.isConnected && (
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                          <FileText className="h-4 w-4 inline mr-1" />
                          View Records
                        </button>
                      )}
                    </div>
                    {!pharmacy.isConnected && (
                      <button 
                        onClick={() => connectPharmacy(pharmacy.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Connect Pharmacy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Medical Records</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <FileText className="h-4 w-4 inline mr-2" />
                Export Records
              </button>
            </div>

            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold capitalize">{record.visitType}</h4>
                      <p className="text-gray-600">
                        {new Date(record.visitDate).toLocaleDateString()} - {record.diagnosis}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {hospitals.find(h => h.id === record.hospitalId)?.name || 'Unknown Hospital'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium mb-2">Symptoms</h5>
                      <p className="text-gray-600">{record.symptoms.join(', ')}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Treatment</h5>
                      <p className="text-gray-600">{record.treatment}</p>
                    </div>
                  </div>

                  {record.notes && (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Notes</h5>
                      <p className="text-gray-600">{record.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {record.prescriptions.length} prescriptions
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Sync Logs</h3>
            <div className="space-y-4">
              {syncLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium capitalize">{log.entityType} Sync</h4>
                      <p className="text-sm text-gray-600">
                        {log.syncType === 'sync' ? 'Data synced with' : log.syncType === 'connect' ? 'Connected to' : 'Disconnected from'} {log.entityId}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      log.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : log.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{log.message}</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 