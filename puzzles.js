Molpy.DefinePuzzles=function()
{
	Molpy.Puzzle=function()
	{
		this.operators=['and','or'];
		this.Generate=function()
		{
			this.firstTry=1;
			this.level=Molpy.Level('Logicat');
			var statementNames='ABCDEFGHIJ';
			var shuffledNames=statementNames.split('');
			ShuffleList(shuffledNames);
			var n = flandom(Math.ceil(Math.PI))+Math.ceil(Math.PI);
			
			var statements=[];
			var i = n;
			while(i--)
			{
				var statement={};
				statements[i]=statement;
				statement.id=i;
				statement.name=shuffledNames[i];
				statement.value=flandom(2)==0;
			}//we have now made a list of statements each with a truth value
			var completedStatements=[];
			while(completedStatements.length<n)
			{
				var groupSize = flandom(n)+1;
				var dist3 = Math.abs(groupSize-3)*2;
				if(flandom(dist3+1))groupSize = flandom(n)+1
				var group = statements.splice(groupSize);
				this.FillStatements[groupSize](group);
				completedStatements=completedStatements.concat(group)
			}
			
			ShuffleList(completedStatements);
			
			this.Check=function(guess)
			{
				if(!completedStatements)return;
				var skip=0;
				if(!this.firstTry)
				{
					if(!Molpy.Spend(this.tryCost))
					{
						Molpy.Notify('You can\'t afford a second try.');
						return;
					}
				}
				
				var correct = 0;
				var incorrect = 0;
				for(var i in guess)
				{
					if(completedStatements[i]==guess[i]) correct++;
					else incorrect++;
				}
				
				if(incorrect)
				{
					this.tryCost = {GlassBlocks:50*incorrect};
					if(this.firstTry && Molpy.Got('Second Chance') && Molpy.Has(this.tryCost))					
					{						
						this.firstTry=0;
						Molpy.Notify('You may Try Again for '+Molpy.PriceString(this.tryCost));
						return;
					}
				}
				var points = .5+Molpy.Level('Panther Rush')/2;
				var gain = correct*(this.firstTry*.5+points)-incorrect*points;
				if(gain>0) Molpy.Add('Logicat',0, gain);
				else if (gain < 0)Molpy.Destroy('Logicat',0,-gain);
					
				Molpy.Notify(Molpify(correct)+' answer'+plural(correct)+' correct, '+Molpify(incorrect)+' answer'+plural(incorrect)+' incorrect',1);
				completedStatements=[];	
			}
		}
		this.FillStatements=[
			function(group0){}, //no statements: nothing to do
			function(group1)
			{
				var s = group1[0];
				if(s.value) //tautology or contradiction
				{
					s.operator='or';
				}else{
					s.operator='and';
				}
				s.claims=[];
				s.claims.push({name:s.name,value:true});
				s.claims.push({name:s.name,value:false});
			},
			function(group2)
			{
			},
			function(group3)
			{
			},
			function(group4)
			{
			}
		]
	}
}