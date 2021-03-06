import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';

import { UserContext } from './UserContext';
import walletApi from '../api/walletApi';

export const WalletContext = React.createContext();

const calculateFlow = (transactions) => {
	let inflow = 0;
	let outflow = 0;
	transactions.forEach((transaction) => {
		transaction.expenses.forEach((expense) => {
			if (expense.isIncome) {
				inflow += expense.expense;
			}
			if (!expense.isIncome) {
				outflow += expense.expense;
			}
		});
	});
	return { inflow, outflow };
};

export const WalletProvider = (props) => {
	const { token, currentUser } = useContext(UserContext);

	const [isLoaded, setIsLoaded] = useState(false);

	const [wallets, setWallets] = useState(null);
	const [currentWallet, setCurrentWallet] = useState(null);
	const [virtualWallet, setVirtualWallet] = useState(null);

	useEffect(() => {
		const getWalletsUser = async () => {
			try {
				const { wallets: gotWallets, virtualWallet } = await walletApi.get();

				setWallets(gotWallets);
				setIsLoaded(true);
				setCurrentWallet(virtualWallet);
				setVirtualWallet(virtualWallet);
			} catch (error) {
				console.log(error);
			}
		};

		getWalletsUser();
	}, [token, currentUser]);

	const updateWallet = (updatedWallet) => {
		const newWallets = [...wallets];
		const walletIndex = newWallets.findIndex(
			(wallet) => wallet._id === updatedWallet._id
		);

		if (walletIndex === -1) {
			newWallets.push(updatedWallet);
		} else {
			newWallets.splice(walletIndex, 1, updatedWallet);
		}

		setWallets(newWallets);
	};

	const getExpenseOfMonth = (date, currentWallet) => {
		const transactionsOfMonth = currentWallet.transactions.filter(
			(transaction) => {
				return (
					moment(transaction.date).format('MM/YYYY') ===
					moment(date).format('MM/YYYY')
				);
			}
		);
		//deep clone
		const cloneTrans = JSON.parse(JSON.stringify(transactionsOfMonth));

		cloneTrans.forEach((transaction) => {
			transaction.expenses = transaction.expenses.filter((expense) => {
				return expense.isShowReport !== false;
			});
		});

		const transactionsOfMonthReport = cloneTrans;

		const { inflow, outflow } = calculateFlow(transactionsOfMonth);
		const total = currentWallet.accountBalance;

		return {
			total,
			inflow,
			outflow,
			transactionsOfMonth,
			transactionsOfMonthReport,
		};
	};

	const getExpenseOfDayInMonth = (month, currentWallet) => {
		const transactionsOfMonth = currentWallet.transactions.filter(
			(transaction) => {
				return (
					moment(transaction.date).format('MM/YYYY') ===
					moment(month).format('MM/YYYY')
				);
			}
		);

		// get all transactions in month
		const result = transactionsOfMonth.map((transactionInDay) => {
			return {
				date: moment(transactionInDay.date).format('YYYY/MM/DD'),
				expense: transactionInDay.expenses.reduce((a, b) => a + b.expense, 0),
			};
		});
		return result;
	};

	const getAllExpense = (currentWallet) => {
		return currentWallet.transactions.map((transaction) => {
			return {
				date: moment(transaction.date).format('YYYY/MM/DD'),
				expense: transaction.expenses.reduce((a, b) => a + b.expense, 0),
			};
		});
	};

	const onLogout = () => {
		setWallets(null);
		setCurrentWallet(null);
		setVirtualWallet(null);
	};
	return (
		<WalletContext.Provider
			value={{
				wallets,
				isLoaded,
				setWallets,
				currentWallet,
				getExpenseOfMonth,
				updateWallet,
				setCurrentWallet,
				virtualWallet,
				setVirtualWallet,
				onLogout,
				getExpenseOfDayInMonth,
				getAllExpense,
			}}
		>
			{props.children}
		</WalletContext.Provider>
	);
};
