import CodeSubmissionForm from '@/components/CodeSubmissionForm';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-charcoalBlack text-softSilver p-6">
      <h1 className="text-3xl font-bold mb-6">Submit Your Code</h1>
      <CodeSubmissionForm />
    </div>
  );
}