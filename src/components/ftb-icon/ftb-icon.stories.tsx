import { Component, h, Host } from '@stencil/core';

import FootballistaIcon from '../../assets/icons/footballista.svg';

import AppleIcon from '../../assets/icons/apple.svg';
import GoogleIcon from '../../assets/icons/google.svg';
import VkIcon from '../../assets/icons/vk.svg';
import FbIcon from '../../assets/icons/fb.svg';

import ShieldIcon from '../../assets/icons/shield.svg';
import ArticleIcon from '../../assets/icons/article.svg';
import LocationIcon from '../../assets/icons/location.svg';
import AvatarIcon from '../../assets/icons/avatar.svg';
import BalloonIcon from '../../assets/icons/balloon.svg';

import AssistIcon from '../../assets/icons/assist.svg';
import GoalIcon from '../../assets/icons/goal.svg';
import WhistleIcon from '../../assets/icons/whistle.svg';

import BasketballIcon from '../../assets/icons/basketball-filled.svg';
import FootballIcon from '../../assets/icons/football-filled.svg';
import VolleyballIcon from '../../assets/icons/volleyball-filled.svg';

import CameraIcon from '../../assets/icons/camera.svg';
import PhotoIcon from '../../assets/icons/photo.svg';

import ChevronIcon from '../../assets/icons/chevron-down.svg';
import CloseIcon from '../../assets/icons/close.svg';
import DownloadIcon from '../../assets/icons/download.svg';
import ShareIcon from '../../assets/icons/share.svg';
import SearchIcon from '../../assets/icons/search.svg';

@Component({
  tag: 'ftb-icon-stories',
  styleUrl: 'ftb-icon.stories.scss',
  shadow: false,
})
export class FtbIconStories {
  render() {
    return (
      <Host>
        <h1>Icon</h1>
        <p>Inline SVG helper</p>
        <ftb-code-snippet code="<ftb-icon svg={YourIcon}/>" />

        <h2>Footballista icon set</h2>
        <div class="icons-set">
          <ftb-icon svg={FootballistaIcon} />
        </div>

        <div class="icons-set">
          <ftb-icon svg={FootballIcon} />
          <ftb-icon svg={BasketballIcon} />
          <ftb-icon svg={VolleyballIcon} />
        </div>
        <div class="icons-set">
          <ftb-icon svg={GoalIcon} />
          <ftb-icon svg={AssistIcon} />
          <ftb-icon svg={WhistleIcon} />
        </div>
        <div class="icons-set">
          <ftb-icon svg={CameraIcon} />
          <ftb-icon svg={PhotoIcon} />
        </div>
        <div class="icons-set">
          <ftb-icon svg={ShieldIcon} />
          <ftb-icon svg={AvatarIcon} />
          <ftb-icon svg={LocationIcon} />
          <ftb-icon svg={ArticleIcon} />
          <ftb-icon svg={BalloonIcon} />
        </div>
        <div class="icons-set">
          <ftb-icon svg={ChevronIcon} />
          <ftb-icon svg={CloseIcon} />
          <ftb-icon svg={DownloadIcon} />
          <ftb-icon svg={ShareIcon} />
          <ftb-icon svg={SearchIcon} />
        </div>
        <div class="icons-set">
          <ftb-icon svg={AppleIcon} />
          <ftb-icon svg={GoogleIcon} />
          <ftb-icon svg={VkIcon} />
          <ftb-icon svg={FbIcon} />
        </div>
      </Host>
    );
  }
}
