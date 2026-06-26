import { useState, FormEvent } from 'react';
import { CreditCard, CheckCircle2, Plus, ArrowRight, Download, Receipt, Check, ShieldAlert } from 'lucide-react';
import { UserProfile, BillingRecord } from '../types';

interface AccountViewProps {
  userProfile: UserProfile;
  billingHistory: BillingRecord[];
  onUpgradePlan: () => void;
  onCancelPlan: () => void;
  onAddPayment: (amount: number, description: string) => void;
  onAddNotification: (title: string, message: string) => void;
}

interface PaymentCard {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiry: string;
}

export default function AccountView({
  userProfile,
  billingHistory,
  onUpgradePlan,
  onCancelPlan,
  onAddPayment,
  onAddNotification,
}: AccountViewProps) {
  const [selectedCardId, setSelectedCardId] = useState<string>('visa');
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [newCardNumber, setNewCardNumber] = useState<string>('');
  const [newCardExpiry, setNewCardExpiry] = useState<string>('');
  const [newCardCvc, setNewCardCvc] = useState<string>('');
  const [newCardType, setNewCardType] = useState<'Visa' | 'Mastercard' | 'Amex'>('Visa');

  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([
    { id: 'visa', type: 'Visa', last4: '4242', expiry: '12/28' },
    { id: 'mastercard', type: 'Mastercard', last4: '8899', expiry: '08/27' },
  ]);

  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<BillingRecord | null>(null);

  // Upgrade / Cancel plan details flow
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  // Authorize Payment Logic
  const handleAuthorizePayment = () => {
    setPaymentSuccess(true);
    const selectedCard = paymentCards.find((c) => c.id === selectedCardId);
    const cardText = selectedCard ? `${selectedCard.type} ending in ${selectedCard.last4}` : 'Card';

    onAddPayment(userProfile.membershipPrice, `${userProfile.membership} Monthly`);
    onAddNotification(
      'Payment Successful',
      `Authorized $${userProfile.membershipPrice.toFixed(2)} on ${cardText} for your ${userProfile.membership} account.`
    );

    setTimeout(() => {
      setPaymentSuccess(false);
    }, 2000);
  };

  // Add Card logic
  const handleAddCardSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !newCardExpiry) return;

    const last4 = newCardNumber.slice(-4) || '9999';
    const newId = `card-${Date.now()}`;
    const newCard: PaymentCard = {
      id: newId,
      type: newCardType,
      last4: last4,
      expiry: newCardExpiry,
    };

    setPaymentCards([...paymentCards, newCard]);
    setSelectedCardId(newId);
    setShowAddCard(false);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvc('');

    onAddNotification('Payment Method Added', `Successfully saved your ${newCardType} ending in ${last4}.`);
  };

  // Export CSV
  const handleExportHistory = () => {
    const csvContent = [
      ['Date', 'Description', 'Amount', 'Status'],
      ...billingHistory.map((b) => [b.date, b.description, `$${b.amount.toFixed(2)}`, b.status]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `forge_performance_billing_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddNotification('Data Exported', 'Billing statement successfully compiled and downloaded.');
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Title */}
      <section className="mb-4">
        <h1 className="font-display text-5xl uppercase tracking-tighter mb-2">
          Membership & <span className="text-primary-fixed">Account</span>
        </h1>
        <p className="font-body text-xl text-on-surface-variant">
          Control your billing methods, active tiers, and transaction statements.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Subscription Tier */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <section className="bg-surface-container-low border border-outline-variant/30 p-6 relative overflow-hidden left-accent">
            {/* Background design glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed opacity-5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h2 className="font-label text-xs text-primary-fixed mb-2 uppercase tracking-widest font-bold">
                  Current Membership
                </h2>
                <h3 className="font-display text-3xl text-white">{userProfile.membership}</h3>
              </div>
              <span
                className={`px-2.5 py-1 font-label text-[10px] rounded uppercase font-bold ${
                  userProfile.membershipStatus === 'CANCELLED'
                    ? 'bg-red-950/40 text-red-400 border border-red-800/50'
                    : 'bg-primary-fixed text-black volt-glow'
                }`}
              >
                {userProfile.membershipStatus}
              </span>
            </div>

            <div className="mb-8 relative z-10">
              <p className="font-display text-4xl text-white mb-1">
                ${userProfile.membershipPrice}
                <span className="text-sm font-body text-on-surface-variant font-normal lowercase">
                  /mo
                </span>
              </p>
              <p className="font-body text-sm text-on-surface-variant">
                Next billing date: {userProfile.nextBillingDate}
              </p>
            </div>

            {/* Plan list specifications */}
            <div className="space-y-4 mb-8 relative z-10 border-t border-outline-variant/20 pt-6">
              {[
                'Unlimited Access to All Facilities',
                userProfile.membership === 'ELITE TIER'
                  ? '4 Personal Training Sessions / mo'
                  : 'Unlimited Personal Coaching / mo',
                'Priority Class Booking',
                'Recovery Zone Access (Sauna/Cold Plunge)',
              ].map((perk, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-fixed shrink-0" />
                  <span className="font-body text-sm text-white">{perk}</span>
                </div>
              ))}
            </div>

            {/* Sub CTAs */}
            <div className="flex gap-4 relative z-10">
              {userProfile.membership === 'ELITE TIER' &&
              userProfile.membershipStatus !== 'CANCELLED' ? (
                <button
                  onClick={() => setShowUpgradeConfirm(true)}
                  className="bg-primary-fixed text-black font-label text-xs font-bold py-3.5 px-6 rounded-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex-1 cursor-pointer volt-glow text-center active:scale-95"
                >
                  Upgrade Plan
                </button>
              ) : (
                userProfile.membershipStatus === 'CANCELLED' && (
                  <button
                    onClick={onUpgradePlan}
                    className="bg-primary-fixed text-black font-label text-xs font-bold py-3.5 px-6 rounded-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex-1 cursor-pointer volt-glow text-center active:scale-95"
                  >
                    Reactivate Membership
                  </button>
                )
              )}

              {userProfile.membershipStatus !== 'CANCELLED' && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="border border-white text-white hover:border-red-600 hover:text-red-500 font-label text-xs py-3.5 px-6 rounded-sm uppercase tracking-wider bg-transparent transition-all duration-300 flex-1 cursor-pointer text-center active:scale-95"
                >
                  Cancel Plan
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Make a Payment Form */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section className="bg-surface-container-low border border-outline-variant/30 p-6">
            <h2 className="font-display text-2xl text-white mb-6 uppercase tracking-wide">
              Make a Payment
            </h2>

            {paymentSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-primary-fixed text-black rounded-full flex items-center justify-center mx-auto volt-glow animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-tighter text-white">
                  Payment Authorized
                </h3>
                <p className="font-body text-md text-on-surface-variant">
                  We processed your subscription successfully. Check your statements below!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Fixed Amount */}
                <div>
                  <label className="font-label text-[10px] text-on-surface-variant block mb-2 uppercase tracking-widest font-bold">
                    Amount
                  </label>
                  <div className="relative border-b border-outline-variant/65 pb-2">
                    <span className="absolute left-0 bottom-2 text-white font-display text-3xl">
                      $
                    </span>
                    <input
                      className="w-full bg-transparent text-white font-display text-3xl pl-6 focus:outline-none cursor-default"
                      readOnly
                      type="text"
                      value={userProfile.membershipPrice.toFixed(2)}
                    />
                  </div>
                </div>

                {/* Card Methods Selectors */}
                <div>
                  <label className="font-label text-[10px] text-on-surface-variant block mb-4 uppercase tracking-widest font-bold">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentCards.map((card) => {
                      const isSelected = selectedCardId === card.id;
                      return (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCardId(card.id)}
                          className={`border rounded-sm p-4 flex items-center justify-between cursor-pointer relative overflow-hidden group transition-all duration-300 ${
                            isSelected
                              ? 'border-primary-fixed bg-surface-container'
                              : 'border-outline-variant/30 bg-surface-dim hover:border-on-surface-variant'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary-fixed opacity-5" />
                          )}
                          <div className="flex items-center gap-3 relative z-10">
                            <CreditCard
                              className={`w-5 h-5 ${
                                isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'
                              }`}
                            />
                            <div>
                              <p className="font-body text-sm text-white">
                                {card.type} ending in {card.last4}
                              </p>
                              <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-wider">
                                Exp {card.expiry}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-primary-fixed bg-primary-fixed'
                                : 'border-outline-variant'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setShowAddCard(true)}
                    className="mt-4 flex items-center gap-2 text-primary-fixed font-label text-[10px] font-bold hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Method
                  </button>
                </div>

                {/* Submit payment */}
                <button
                  onClick={handleAuthorizePayment}
                  className="bg-primary-fixed text-black font-display w-full py-4 uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 rounded-sm cursor-pointer volt-glow text-lg active:scale-95"
                >
                  Authorize Payment <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Bottom Section: Billing History */}
        <div className="lg:col-span-12 mt-4">
          <section className="bg-surface-container-low border border-outline-variant/30 p-6">
            <div className="flex justify-between items-end mb-6 border-b border-outline-variant/20 pb-4">
              <h2 className="font-display text-2xl text-white uppercase tracking-wide">
                Billing History
              </h2>
              <button
                onClick={handleExportHistory}
                className="border border-white text-white hover:border-primary-fixed hover:text-primary-fixed font-label text-[9px] font-bold py-2 px-4 rounded-sm uppercase tracking-wider bg-transparent transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="font-label text-[11px] font-bold uppercase tracking-wider text-on-surface-variant py-3 px-4">
                      Date
                    </th>
                    <th className="font-label text-[11px] font-bold uppercase tracking-wider text-on-surface-variant py-3 px-4">
                      Description
                    </th>
                    <th className="font-label text-[11px] font-bold uppercase tracking-wider text-on-surface-variant py-3 px-4">
                      Amount
                    </th>
                    <th className="font-label text-[11px] font-bold uppercase tracking-wider text-on-surface-variant py-3 px-4">
                      Status
                    </th>
                    <th className="font-label text-[11px] font-bold uppercase tracking-wider text-on-surface-variant py-3 px-4 text-right">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm text-white">
                  {billingHistory.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b border-outline-variant/10 hover:bg-surface-container transition-colors"
                    >
                      <td className="py-4 px-4 text-on-surface-variant">{bill.date}</td>
                      <td className="py-4 px-4 font-semibold">{bill.description}</td>
                      <td className="py-4 px-4 font-display text-md text-white">
                        ${bill.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 bg-green-950/40 text-primary-fixed font-label text-[9px] uppercase tracking-wider border border-green-800/40 rounded-sm font-bold">
                          {bill.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceipt(bill)}
                          className="text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Upgrade Subscription Modal */}
      {showUpgradeConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant max-w-sm w-full p-6 rounded-sm text-center relative shadow-2xl space-y-6">
            <h3 className="font-display text-2xl uppercase tracking-tighter text-primary-fixed">
              Upgrade to PRO ATHLETE
            </h3>
            <p className="font-body text-sm text-on-surface-variant">
              Upgrade your access level to <span className="text-white font-bold">PRO ATHLETE Tier</span> for{' '}
              <span className="text-white font-bold">$299.00/mo</span>. This unlocks unlimited 1-on-1 performance coaching, personalized biomechanic screenings, and access to all VIP recovering suites.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeConfirm(false)}
                className="flex-1 bg-surface-bright text-white border border-outline-variant/30 font-label text-[11px] py-3 uppercase tracking-wider rounded-sm hover:border-white cursor-pointer"
              >
                No, Stay Elite
              </button>
              <button
                onClick={() => {
                  onUpgradePlan();
                  setShowUpgradeConfirm(false);
                }}
                className="flex-1 bg-primary-fixed text-black font-label text-[11px] font-bold py-3 uppercase tracking-wider rounded-sm hover:bg-white volt-glow cursor-pointer"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant max-w-sm w-full p-6 rounded-sm text-center relative shadow-2xl space-y-6">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="font-display text-2xl uppercase tracking-tighter text-white">
              Cancel Membership?
            </h3>
            <p className="font-body text-sm text-on-surface-variant">
              Are you sure you want to cancel your <span className="text-white font-bold">{userProfile.membership}</span>? You will lose advanced priority class booking and active coaching allocations immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-surface-bright text-white border border-outline-variant/30 font-label text-[11px] py-3 uppercase tracking-wider rounded-sm hover:border-white cursor-pointer"
              >
                Keep Active
              </button>
              <button
                onClick={() => {
                  onCancelPlan();
                  setShowCancelConfirm(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-label text-[11px] font-bold py-3 uppercase tracking-wider rounded-sm cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant max-w-sm w-full p-6 rounded-sm relative shadow-2xl">
            <button
              onClick={() => setShowAddCard(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white font-display text-lg cursor-pointer"
            >
              ✕
            </button>
            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <h3 className="font-display text-xl uppercase tracking-tighter text-white">
                Add Payment Method
              </h3>

              <div className="space-y-1">
                <label className="font-label text-[9px] text-on-surface-variant uppercase tracking-wider block">
                  Card Type
                </label>
                <div className="flex gap-2">
                  {['Visa', 'Mastercard', 'Amex'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewCardType(type as any)}
                      className={`flex-1 py-1.5 rounded-sm border font-label text-[10px] uppercase tracking-wider cursor-pointer ${
                        newCardType === type
                          ? 'border-primary-fixed bg-primary-fixed/10 text-primary-fixed'
                          : 'border-outline-variant/30 bg-surface-dim text-on-surface-variant'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label text-[9px] text-on-surface-variant uppercase tracking-wider block">
                  Card Number
                </label>
                <input
                  type="text"
                  maxLength={19}
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  placeholder="4111 2222 3333 4242"
                  className="w-full bg-surface-dim border border-outline-variant/40 p-2 text-sm text-white focus:outline-none focus:border-primary-fixed rounded-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-label text-[9px] text-on-surface-variant uppercase tracking-wider block">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/29"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="w-full bg-surface-dim border border-outline-variant/40 p-2 text-sm text-white focus:outline-none focus:border-primary-fixed rounded-sm text-center"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label text-[9px] text-on-surface-variant uppercase tracking-wider block">
                    CVC Code
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="***"
                    value={newCardCvc}
                    onChange={(e) => setNewCardCvc(e.target.value)}
                    className="w-full bg-surface-dim border border-outline-variant/40 p-2 text-sm text-white focus:outline-none focus:border-primary-fixed rounded-sm text-center"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-fixed text-black font-label text-xs font-bold py-3 uppercase tracking-wider rounded-sm hover:bg-white volt-glow transition-all mt-4 cursor-pointer"
              >
                Save Payment Method
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Details Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant max-w-sm w-full p-6 rounded-sm relative shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white font-display text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="font-display text-sm tracking-widest text-primary-fixed uppercase block">
                FORGE PERFORMANCE INC
              </span>
              <h3 className="font-display text-2xl uppercase tracking-tighter text-white mt-2">
                TRANSACTION RECEIPT
              </h3>
            </div>

            <div className="space-y-3 border-t border-b border-outline-variant/35 py-4 font-body text-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Receipt Number:</span>
                <span className="text-white font-mono">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date Issued:</span>
                <span className="text-white">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Billing Code:</span>
                <span className="text-white uppercase">SUB-{selectedReceipt.id.slice(0, 6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Description:</span>
                <span className="text-white">{selectedReceipt.description}</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/20 pt-3">
                <span className="font-bold text-white uppercase font-label text-xs">Total Charged:</span>
                <span className="font-display text-xl text-primary-fixed">
                  ${selectedReceipt.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 bg-surface-bright text-white border border-outline-variant/30 font-label text-[11px] py-3 uppercase tracking-wider rounded-sm hover:border-white cursor-pointer"
              >
                Close Receipt
              </button>
              <button
                onClick={() => {
                  alert('Receipt print simulation successful!');
                  setSelectedReceipt(null);
                }}
                className="flex-1 bg-primary-fixed text-black font-label text-[11px] font-bold py-3 uppercase tracking-wider rounded-sm hover:bg-white volt-glow cursor-pointer"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
