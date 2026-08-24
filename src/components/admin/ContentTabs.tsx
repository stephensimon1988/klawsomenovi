import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiRowEditor, SingleRowEditor } from './CmsEditors';
import type { ReactNode } from 'react';

const SHOPIFY_NOTE =
  '⚠️ These prices are display copy only. The amount customers are actually charged comes from the matching Shopify product — update Shopify too if a price changes.';

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader><CardTitle className="text-white font-heading">{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export type ContentTab = {
  value: string;
  label: string;
  render: (password: string) => ReactNode;
};

export const CONTENT_TABS: ContentTab[] = [
  {
    value: 'tokens',
    label: '💰 Token Prices',
    render: (pw) => (
      <Panel title="Token Prices">
        <MultiRowEditor password={pw} table="token_tiers" columns={[
          { key: 'price', label: 'Price' },
          { key: 'tokens', label: 'Tokens' },
          { key: 'bonus', label: 'Bonus' },
          { key: 'is_highlight', label: 'Top Pick', type: 'bool' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'news',
    label: '📰 News / Press',
    render: (pw) => (
      <Panel title="News & Press">
        <MultiRowEditor password={pw} table="news_articles" searchKeys={['title', 'source']} columns={[
          { key: 'title', label: 'Title', type: 'textarea' },
          { key: 'source', label: 'Source' },
          { key: 'date', label: 'Date' },
          { key: 'url', label: 'Link', type: 'textarea' },
          { key: 'image_url', label: 'Image URL', type: 'textarea' },
          { key: 'is_active', label: 'Visible', type: 'bool' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'faq',
    label: '❓ FAQ',
    render: (pw) => (
      <Panel title="FAQ">
        <MultiRowEditor password={pw} table="faq_items" searchKeys={['question', 'answer']} filterKey="page" filterLabel="pages" columns={[
          { key: 'question', label: 'Question', type: 'textarea' },
          { key: 'answer', label: 'Answer', type: 'textarea' },
          { key: 'page', label: 'Page', width: '120px' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'careers',
    label: '💼 Careers',
    render: (pw) => (
      <Panel title="Careers">
        <MultiRowEditor password={pw} table="job_listings" searchKeys={['title', 'category']} filterKey="category" filterLabel="categories" columns={[
          { key: 'title', label: 'Role' },
          { key: 'category', label: 'Category' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'image_url', label: 'Image URL', type: 'textarea' },
          { key: 'job_desc_url', label: 'Job Desc Link', type: 'textarea' },
          { key: 'apply_url', label: 'Apply Link', type: 'textarea' },
          { key: 'is_paid', label: 'Paid', type: 'bool' },
          { key: 'is_active', label: 'Visible', type: 'bool' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'parties',
    label: '🎉 Party Packages',
    render: (pw) => (
      <Panel title="Party Packages">
        <MultiRowEditor password={pw} table="party_options" note={SHOPIFY_NOTE} columns={[
          { key: 'name', label: 'Name' },
          { key: 'price', label: 'Price' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'features', label: 'Features (one per line)', type: 'array' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'rentals',
    label: '🎪 Rental Packages',
    render: (pw) => (
      <Panel title="Rental Packages">
        <MultiRowEditor password={pw} table="rental_packages" note={SHOPIFY_NOTE} columns={[
          { key: 'name', label: 'Name' },
          { key: 'price', label: 'Price' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'features', label: 'Features (one per line)', type: 'array' },
          { key: 'cta_text', label: 'Button Text' },
          { key: 'cta_url', label: 'Button Link', type: 'textarea' },
          { key: 'is_highlight', label: 'Highlight', type: 'bool' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'homepage',
    label: '🏠 Homepage Copy',
    render: (pw) => (
      <div className="space-y-6">
        <Panel title="Homepage Copy">
          <SingleRowEditor password={pw} table="homepage_content" fields={[
            { key: 'hero_headline', label: 'Hero Headline' },
            { key: 'hero_subheadline', label: 'Hero Subheadline', multiline: true },
            { key: 'hero_cta_text', label: 'Hero Button Text' },
            { key: 'hero_image_url', label: 'Hero Image URL' },
            { key: 'story_title', label: 'Story Title' },
            { key: 'story_body', label: 'Story Body', multiline: true },
            { key: 'story_image_url', label: 'Story Image URL' },
            { key: 'about_title', label: 'About Title' },
            { key: 'about_subtitle', label: 'About Subtitle', multiline: true },
          ]} />
        </Panel>
        <Panel title="How It Works Steps">
          <MultiRowEditor password={pw} table="homepage_steps" columns={[
            { key: 'icon', label: 'Icon', width: '90px' },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
          ]} />
        </Panel>
      </div>
    ),
  },
  {
    value: 'gallery',
    label: '🖼 Gallery',
    render: (pw) => (
      <Panel title="Gallery Photos">
        <MultiRowEditor password={pw} table="gallery_photos" searchKeys={['caption', 'section']} filterKey="section" filterLabel="albums" columns={[
          { key: 'image_url', label: 'Preview', type: 'image', width: '90px' },
          { key: 'section', label: 'Album' },
          { key: 'caption', label: 'Caption', type: 'textarea' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'reviews',
    label: '⭐ Reviews',
    render: (pw) => (
      <Panel title="Reviews">
        <MultiRowEditor password={pw} table="reviews" searchKeys={['author_name', 'review_text']} columns={[
          { key: 'author_name', label: 'Author' },
          { key: 'author_role', label: 'Role' },
          { key: 'review_text', label: 'Review', type: 'textarea' },
          { key: 'rating', label: 'Rating', type: 'number', width: '90px' },
          { key: 'is_active', label: 'Visible', type: 'bool' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'banners',
    label: '🏷 Page Banners',
    render: (pw) => (
      <Panel title="Page Banners">
        <MultiRowEditor password={pw} table="page_heroes" searchKeys={['page_key', 'title']} columns={[
          { key: 'page_key', label: 'Page', width: '140px' },
          { key: 'eyebrow', label: 'Eyebrow' },
          { key: 'title', label: 'Title', type: 'textarea' },
          { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
          { key: 'image_url', label: 'Image URL', type: 'textarea' },
          { key: 'cta_text', label: 'Button Text' },
          { key: 'cta_url', label: 'Button Link', type: 'textarea' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'announcement',
    label: '📣 Announcement',
    render: (pw) => (
      <Panel title="Announcement Banner">
        <p className="text-xs text-white/50 mb-4 font-heading">
          Shows under the Hours block on the homepage — use it for seasonal notices like special summer hours or holiday closures.
        </p>
        <SingleRowEditor password={pw} table="site_settings" fields={[
          { key: 'announcement_enabled', label: 'Show Banner', type: 'bool' },
          { key: 'announcement_title', label: 'Title' },
          { key: 'announcement_body', label: 'Message', multiline: true },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'service-area',
    label: '🛡 Service Area',
    render: (pw) => (
      <Panel title="Klawsome Mobile Service Area">
        <p className="text-xs text-white/50 mb-4 font-heading">
          Controls which ZIP codes can book Klawsome Mobile. Level must be one of:{' '}
          <strong>allowed</strong> (books normally), <strong>review</strong> (customer must call to confirm
          before checkout), or <strong>blocked</strong> (cannot book online). Any ZIP not listed here is
          treated as allowed.
        </p>
        <MultiRowEditor password={pw} table="service_area_zips" searchKeys={['zip', 'city', 'notes']} filterKey="level" filterLabel="levels" columns={[
          { key: 'zip', label: 'ZIP', width: '90px' },
          { key: 'city', label: 'City / Neighborhood' },
          { key: 'level', label: 'Level', width: '120px' },
          { key: 'notes', label: 'Internal Note', type: 'textarea' },
          { key: 'sort_order', label: 'Order', type: 'number', width: '90px' },
        ]} />
      </Panel>
    ),
  },
  {
    value: 'machine-rentals',
    label: '🕹 Machine Rental Pricing',
    render: (pw) => (
      <Panel title="Machine Rental Pricing">
        <p className="text-xs text-white/50 mb-4 font-heading">
          Live pricing used by the booking wizard for Klaw Mini and Klaw Classic. Machine must be{' '}
          <strong>mini</strong> or <strong>classic</strong>; day type <strong>weekday</strong>,{' '}
          <strong>weekend</strong> or <strong>any</strong>; unit <strong>whole_day</strong>,{' '}
          <strong>first_block</strong> or <strong>extra_block</strong>. Variant ID must match the Shopify
          variant that gets charged.
        </p>
        <MultiRowEditor password={pw} table="booking_rental_pricing" searchKeys={['machine', 'label']} filterKey="machine" filterLabel="machines" columns={[
          { key: 'machine', label: 'Machine', width: '110px' },
          { key: 'day_type', label: 'Day Type', width: '110px' },
          { key: 'unit', label: 'Unit', width: '130px' },
          { key: 'label', label: 'Label' },
          { key: 'price_cents', label: 'Price (cents)', type: 'number', width: '120px' },
          { key: 'variant_id', label: 'Shopify Variant ID' },
          { key: 'is_active', label: 'Active', type: 'bool' },
        ]} />
        <div className="mt-8">
          <p className="text-xs text-white/50 mb-3 font-heading">
            Delivery fees, free-mile allowance and plush packs. Option key must be{' '}
            <strong>delivery_base</strong>, <strong>free_miles</strong> or <strong>plush_pack</strong>.
          </p>
          <MultiRowEditor password={pw} table="booking_rental_options" searchKeys={['machine', 'option_key', 'label']} filterKey="machine" filterLabel="machines" columns={[
            { key: 'machine', label: 'Machine', width: '110px' },
            { key: 'option_key', label: 'Option', width: '140px' },
            { key: 'label', label: 'Label' },
            { key: 'price_cents', label: 'Price (cents)', type: 'number', width: '120px' },
            { key: 'numeric_value', label: 'Number', type: 'number', width: '100px' },
            { key: 'variant_id', label: 'Shopify Variant ID' },
            { key: 'is_active', label: 'Active', type: 'bool' },
          ]} />
        </div>
      </Panel>
    ),
  },
];

