import React, { useContext } from 'react';
import moment from 'moment';

import AddExpenseModal from '../AddExpenseModal/AddExpenseModal';

import { UserContext } from '../../contexts/UserContext';
import { MenuContext } from '../../contexts/MenuContext';

import { ReactComponent as SearchIcon } from '../../images/search-icon.svg';
import { ReactComponent as CalendarIcon } from '../../images/calendar-icon.svg';
import { ReactComponent as MenuIcon } from '../../images/menu.svg';
import TotalIcon from '../../images/total-icon.png';

import './Header.css';

function Header() {
	const { currentUser } = useContext(UserContext);
	const { isShow, setIsShow } = useContext(MenuContext);

	// Get current date.
	const currentDate = moment().format('DD');

	const handleBurgerClick = () => {
		setIsShow(!isShow);
	};

	return currentUser ? (
		<div className="Header">
			<div className="HeaderLeftWrapper">
				<div className="HeaderLeftContent">
					<button>
						<img src={TotalIcon} alt="total" />
						<div className="TitleAmount">
							<div>Tổng cộng</div>
							<div>628613</div>
						</div>
					</button>
				</div>
			</div>
			<div className="HeaderRightWrapper">
				<div className="HeaderRightContent">
					<ul>
						<li>
							<button>
								<div className="CalendarIcon">
									<CalendarIcon width="20" height="20" />
									<span>{currentDate}</span>
								</div>
							</button>
						</li>
						<li>
							<button>
								<SearchIcon width="20" height="20" />
							</button>
						</li>
						<li>
							<AddExpenseModal />
						</li>
					</ul>
				</div>
			</div>
			<div className="burger-btn-container">
				<button className="burger-button" onClick={handleBurgerClick}>
					<MenuIcon />
				</button>
			</div>
		</div>
	) : (
		<div></div>
	);
}

export default Header;
