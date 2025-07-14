import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router';
import ClaimReview from '@/components/hrReview/ClaimReview';
import FinalHRReview from '@/components/hrReview/FinalHRReview';
import { ClipboardList } from 'lucide-react';
import AppHeading from '@/components/common/AppHeading';
import ReviewClaim from './reviewClaim/ReviewClaim';
import AfterDocReview from '@/components/hr2/AfterDocReview';

const HRReviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'review';

  const handleTabChange = (value: string) => {
    searchParams.set('tab', value);
    setSearchParams(searchParams);
  };

  return (
    <div className="p-6 bg-gray-50 ">
      <AppHeading title="Pending Request List" subtitle="Manage and review medical claims and approval requests" icon={<ClipboardList />} />

      <Tabs value={tabFromUrl} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-white shadow-sm rounded-md mb-4">
          <TabsTrigger value="review" className="w-1/2">
            Review Claim
          </TabsTrigger>
          <TabsTrigger value="approve" className="w-full">
            Pending Final Approval
          </TabsTrigger>
        </TabsList>

        <TabsContent value="review">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <ReviewClaim />
          </div>
        </TabsContent>

        <TabsContent value="approve">
          <AfterDocReview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRReviewPage;
