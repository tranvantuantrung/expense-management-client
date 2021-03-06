import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import classNames from 'classnames';

import './Transactions.css';

import { ReactComponent as BackIcon } from '../../images/back.svg';
import { ReactComponent as NextIcon } from '../../images/next.svg';

import { MenuContext } from '../../contexts/MenuContext';
import { WalletContext } from '../../contexts/WalletContext';
import { ExpenseContext } from '../../contexts/ExpenseContext';

import { Transaction, TransactionDetail } from '../index';

export default function Transactions() {
	const [subtract, setSubtract] = useState(0);
	const [inflow, setInflow] = useState(0);
	const [outflow, setOutflow] = useState(0);
	const [transactionsOfMonth, setTransactionsOfMonth] = useState([]);

	const { setIsActive } = useContext(MenuContext);
	const { currentWallet, getExpenseOfMonth } = useContext(WalletContext);
	const { isShow } = useContext(ExpenseContext);

	const startOfMonth = moment().subtract(subtract, 'month').startOf('month');
	const endOfMonth = moment().subtract(subtract, 'month').endOf('month');

	const getLastMonth = (e) => {
		setSubtract((subtract) => subtract + 1);
	};

	const getNextMonth = (e) => {
		setSubtract((subtract) => subtract - 1);
	};

	useEffect(() => {
		const { inflow, outflow, transactionsOfMonth } = getExpenseOfMonth(
			startOfMonth.toISOString(),
			currentWallet
		);
		setInflow(inflow);
		setOutflow(outflow);
		setTransactionsOfMonth(transactionsOfMonth);
	}, [subtract, currentWallet]);

	return (
		<div className="Transactions">
			<div
				className={classNames({
					'transactions-wrapper': true,
					left: isShow,
					'display-lg': isShow,
				})}
			>
				<div className="top-bar">
					<div className="top-bar-wrapper">
						<div className="top-bar-btn" onClick={getLastMonth}>
							<Button type="primary" shape="circle">
								<BackIcon />
							</Button>
						</div>
						<div className="date">
							{`${startOfMonth.format('DD/MM/YYYY')} - ${endOfMonth.format(
								'DD/MM/YYYY'
							)}`}
							{subtract === 0 && <span>(Tháng này)</span>}
						</div>
						<div className="top-bar-btn" onClick={getNextMonth}>
							<Button type="primary" shape="circle">
								<NextIcon />
							</Button>
						</div>
					</div>
				</div>
				<div className="total">
					<div className="total-wrapper">
						<div className="inflow">
							<div>Dòng tiền vào</div>
							<span>{`+${inflow.toLocaleString()} đ`}</span>
						</div>
						<div className="outflow">
							<div>Dòng tiền ra</div>
							<span>{`${outflow.toLocaleString()} đ`}</span>
						</div>
						<div className="result">
							<span>{`${(inflow + outflow).toLocaleString()} đ`}</span>
						</div>
						<Link
							to={`/report/${startOfMonth.format('YYYY-MM')}`}
							onClick={() => setIsActive('report')}
						>
							Xem báo cáo cụ thể
						</Link>
					</div>
				</div>
				<Transaction transactions={transactionsOfMonth} />
			</div>
			{isShow && <TransactionDetail />}
		</div>
	);
}
