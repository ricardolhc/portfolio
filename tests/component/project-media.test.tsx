import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProjectMedia } from '../../src/presentation/components/ProjectMedia';
import type { ProjectImage } from '../../src/presentation/projects/catalog';
import { projectAssets } from '../../src/presentation/projects/catalog';
import { renderWithProviders, testDependencies } from '../renderWithProviders';

const images: ProjectImage[] = [
  {
    src: 'fixtures/dashboard.webp',
    width: 1200,
    height: 800,
    alt: { 'pt-BR': 'Dashboard anonimizado', en: 'Anonymized dashboard' },
  },
  {
    src: 'fixtures/search.webp',
    width: 1200,
    height: 800,
    alt: { 'pt-BR': 'Pesquisa anonimizada', en: 'Anonymized search' },
  },
];
describe.each(['pt-BR', 'en'] as const)('project media in %s', (language) => {
  it.each(['01', '02'])(
    'prepares private project %s image before the native dialog opens',
    (project) => {
      renderWithProviders(
        <ProjectMedia
          images={projectAssets[project]!.images}
          title="Private"
        />,
        testDependencies(language).registry,
      );
      const thumbnail = screen.getByRole('img');
      const dialog = screen.getByRole('dialog', { hidden: true });
      const fullImage = within(dialog).getByRole('img', { hidden: true });
      expect(fullImage).toHaveAttribute('src', thumbnail.getAttribute('src'));
      expect(fullImage).toHaveAttribute('alt', thumbnail.getAttribute('alt'));
      expect(dialog).not.toHaveAttribute('open');
    },
  );
  it('renders no frame or broken image when private screenshots have not been supplied', () => {
    const { container } = renderWithProviders(
      <ProjectMedia images={[]} title="Private" />,
      testDependencies(language).registry,
    );
    expect(container.querySelector('figure')).toBeNull();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
  it('changes images only through manual controls and wraps in both directions', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ProjectMedia images={images} title="Finance" />,
      testDependencies(language).registry,
    );
    expect(screen.getByRole('img')).toHaveAccessibleName(
      images[0]!.alt[language],
    );
    const next = screen.getByRole('button', {
      name: language === 'en' ? 'Next image' : 'Próxima imagem',
    });
    await user.click(next);
    expect(screen.getByRole('img')).toHaveAccessibleName(
      images[1]!.alt[language],
    );
    expect(screen.getByText('2 / 2')).toBeVisible();
    await user.click(next);
    expect(screen.getByRole('img')).toHaveAccessibleName(
      images[0]!.alt[language],
    );
    await user.click(
      screen.getByRole('button', {
        name: language === 'en' ? 'Previous image' : 'Imagem anterior',
      }),
    );
    expect(screen.getByRole('img')).toHaveAccessibleName(
      images[1]!.alt[language],
    );
  });
  it('replaces a failed image with a translated status and allows another image to be selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ProjectMedia images={images} title="Finance" />,
      testDependencies(language).registry,
    );
    fireEvent.error(screen.getByRole('img'));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      language === 'en'
        ? 'Image temporarily unavailable.'
        : 'Imagem temporariamente indisponível.',
    );
    await user.click(
      screen.getByRole('button', {
        name: language === 'en' ? 'Next image' : 'Próxima imagem',
      }),
    );
    expect(screen.getByRole('img')).toHaveAccessibleName(
      images[1]!.alt[language],
    );
  });
});
