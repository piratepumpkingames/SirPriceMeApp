const PRO_ENTITLEMENT_ID = 'pro';

type RevenueCatEntitlement = {
  expires_date?: string | null;
};

type RevenueCatSubscriberResponse = {
  subscriber?: {
    entitlements?: Record<string, RevenueCatEntitlement>;
  };
};

export async function isProSubscriber(appUserId: string): Promise<boolean> {
  const secretKey = Deno.env.get('REVENUECAT_SECRET_API_KEY');
  if (!secretKey) {
    console.error('REVENUECAT_SECRET_API_KEY is not configured');
    return false;
  }

  const response = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    const text = await response.text();
    console.error('RevenueCat API error:', response.status, text);
    return false;
  }

  const payload = (await response.json()) as RevenueCatSubscriberResponse;
  const entitlement = payload.subscriber?.entitlements?.[PRO_ENTITLEMENT_ID];

  if (!entitlement) {
    return false;
  }

  if (!entitlement.expires_date) {
    return true;
  }

  return new Date(entitlement.expires_date).getTime() > Date.now();
}
