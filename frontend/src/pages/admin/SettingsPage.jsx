import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import ProfileForm from '../../components/admin/settings/ProfileForm';
import ChangePasswordForm from '../../components/admin/settings/ChangePasswordForm';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Settings" 
        subtitle="Manage your personal profile and security configurations."
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <ProfileForm />
        <ChangePasswordForm />
      </div>

    </div>
  );
};

export default SettingsPage;
